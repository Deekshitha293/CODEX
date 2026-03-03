"""Inference script to generate Grad-CAM heatmaps."""
from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
from PIL import Image
from torchvision import transforms

from src.data import load_image
from src.model import GradCAM, ModelConfig, build_model, get_target_layer, load_checkpoint


def overlay_heatmap(image: Image.Image, heatmap: np.ndarray, alpha: float = 0.5) -> Image.Image:
    """Overlay heatmap onto the image."""
    heatmap = (heatmap * 255).astype(np.uint8)
    heatmap = Image.fromarray(heatmap).resize(image.size)
    heatmap = heatmap.convert("RGBA")

    color_map = plt.get_cmap("jet")
    heatmap = np.array(heatmap)
    colored = color_map(heatmap[:, :, 0] / 255.0)
    colored = (colored[:, :, :3] * 255).astype(np.uint8)
    colored = Image.fromarray(colored).convert("RGBA")

    base = image.convert("RGBA")
    blended = Image.blend(base, colored, alpha=alpha)
    return blended


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate Grad-CAM heatmap for pneumonia detection")
    parser.add_argument("--image", type=str, required=True, help="Path to input X-ray image")
    parser.add_argument("--checkpoint", type=str, default="models/pneumonia_resnet50.pt", help="Checkpoint path")
    parser.add_argument("--output", type=str, default="outputs/heatmap_overlay.png", help="Output image path")
    parser.add_argument("--image-size", type=int, default=224, help="Input image size")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = build_model(ModelConfig())
    load_checkpoint(model, args.checkpoint)
    model = model.to(device)
    model.eval()

    image = load_image(args.image, image_size=args.image_size)
    preprocess = transforms.Compose(
        [
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225]),
        ]
    )
    input_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(input_tensor)
        pred_class = logits.argmax(dim=1).item()

    cam = GradCAM(model, get_target_layer(model))
    heatmap = cam.generate(input_tensor, class_idx=pred_class).cpu().numpy()

    overlay = overlay_heatmap(image, heatmap)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    overlay.save(output_path)

    label = "PNEUMONIA" if pred_class == 1 else "NORMAL"
    print(f"Prediction: {label}")
    print(f"Saved heatmap to {output_path}")


if __name__ == "__main__":
    main()

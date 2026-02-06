"""Streamlit app for pneumonia detection with Grad-CAM."""
from __future__ import annotations

from pathlib import Path

import streamlit as st
import torch
from PIL import Image

from src.data import load_image
from src.infer import overlay_heatmap
from src.model import GradCAM, ModelConfig, build_model, get_target_layer, load_checkpoint
from torchvision import transforms

st.set_page_config(page_title="Pneumonia Detection", layout="centered")

st.title("Pneumonia Detection from Chest X-Ray")
st.write("Upload a chest X-ray image to see the Grad-CAM heatmap overlay.")

checkpoint_path = st.text_input("Model checkpoint", "models/pneumonia_resnet50.pt")
uploaded_file = st.file_uploader("Choose an X-ray image", type=["png", "jpg", "jpeg"])

if uploaded_file and Path(checkpoint_path).exists():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = build_model(ModelConfig())
    load_checkpoint(model, checkpoint_path)
    model = model.to(device)
    model.eval()

    image = Image.open(uploaded_file).convert("RGB")
    resized = load_image(uploaded_file, image_size=224)

    preprocess = transforms.Compose(
        [
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225]),
        ]
    )
    input_tensor = preprocess(resized).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(input_tensor)
        pred_class = logits.argmax(dim=1).item()

    cam = GradCAM(model, get_target_layer(model))
    heatmap = cam.generate(input_tensor, class_idx=pred_class).cpu().numpy()
    overlay = overlay_heatmap(resized, heatmap)

    label = "PNEUMONIA" if pred_class == 1 else "NORMAL"
    st.subheader(f"Prediction: {label}")
    st.image(image, caption="Original")
    st.image(overlay, caption="Heatmap overlay")
else:
    st.info("Upload an image and ensure the checkpoint path exists.")

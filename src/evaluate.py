"""Evaluate model performance and generate metrics."""
from __future__ import annotations

import argparse
from pathlib import Path

import torch
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_score, recall_score

from src.data import create_dataloaders, download_dataset
from src.model import ModelConfig, build_model, load_checkpoint


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate pneumonia classifier")
    parser.add_argument("--data-dir", type=str, default="data", help="Dataset root directory")
    parser.add_argument("--checkpoint", type=str, default="models/pneumonia_resnet50.pt", help="Checkpoint path")
    parser.add_argument("--image-size", type=int, default=224, help="Input image size")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    dataset_dir = download_dataset(args.data_dir)
    _, _, test_loader = create_dataloaders(dataset_dir, batch_size=16, image_size=args.image_size)

    model = build_model(ModelConfig())
    load_checkpoint(model, args.checkpoint)
    model = model.to(device)
    model.eval()

    all_labels = []
    all_preds = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            preds = outputs.argmax(dim=1).cpu().numpy()
            all_labels.extend(labels.numpy())
            all_preds.extend(preds)

    accuracy = accuracy_score(all_labels, all_preds)
    precision = precision_score(all_labels, all_preds)
    recall = recall_score(all_labels, all_preds)
    cm = confusion_matrix(all_labels, all_preds)

    print("Accuracy:", accuracy)
    print("Precision:", precision)
    print("Recall:", recall)
    print("Confusion Matrix:\n", cm)
    print("\nClassification Report:\n", classification_report(all_labels, all_preds, target_names=["NORMAL", "PNEUMONIA"]))

    report_path = Path("outputs") / "evaluation_metrics.txt"
    report_path.write_text(
        f"Accuracy: {accuracy}\n"
        f"Precision: {precision}\n"
        f"Recall: {recall}\n"
        f"Confusion Matrix:\n{cm}\n",
        encoding="utf-8",
    )
    print(f"Saved metrics to {report_path}")


if __name__ == "__main__":
    main()

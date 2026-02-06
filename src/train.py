"""Training script for pneumonia classifier."""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Dict

import torch
from torch import nn, optim
from torch.utils.data import DataLoader
from tqdm import tqdm

from src.data import create_dataloaders, download_dataset
from src.model import ModelConfig, build_model


def train_one_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
    device: torch.device,
) -> float:
    model.train()
    running_loss = 0.0
    for images, labels in tqdm(dataloader, desc="Training", leave=False):
        images = images.to(device)
        labels = labels.to(device)
        optimizer.zero_grad(set_to_none=True)
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * images.size(0)
    return running_loss / len(dataloader.dataset)


def evaluate(model: nn.Module, dataloader: DataLoader, device: torch.device) -> Dict[str, float]:
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in tqdm(dataloader, desc="Validating", leave=False):
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    accuracy = correct / total if total > 0 else 0.0
    return {"accuracy": accuracy}


def save_checkpoint(model: nn.Module, optimizer: optim.Optimizer, path: Path, metrics: Dict[str, float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "metrics": metrics,
        },
        path,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train pneumonia detection model")
    parser.add_argument("--data-dir", type=str, default="data", help="Dataset root directory")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--checkpoint", type=str, default="models/pneumonia_resnet50.pt", help="Checkpoint path")
    parser.add_argument("--image-size", type=int, default=224, help="Input image size")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    dataset_dir = download_dataset(args.data_dir)
    train_loader, val_loader, _ = create_dataloaders(
        dataset_dir,
        batch_size=args.batch_size,
        image_size=args.image_size,
    )

    model = build_model(ModelConfig())
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=args.lr)

    best_accuracy = 0.0
    for epoch in range(args.epochs):
        train_loss = train_one_epoch(model, train_loader, criterion, optimizer, device)
        metrics = evaluate(model, val_loader, device)
        accuracy = metrics["accuracy"]
        print(f"Epoch {epoch + 1}/{args.epochs} - loss: {train_loss:.4f} - val_acc: {accuracy:.4f}")

        if accuracy > best_accuracy:
            best_accuracy = accuracy
            save_checkpoint(model, optimizer, Path(args.checkpoint), metrics)
            print(f"Saved checkpoint to {args.checkpoint}")


if __name__ == "__main__":
    main()

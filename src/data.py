"""Dataset utilities for the Chest X-Ray Pneumonia dataset."""
from __future__ import annotations

from pathlib import Path
from typing import Tuple

import kagglehub
from PIL import Image
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

DEFAULT_KAGGLE_DATASET = "paultimothymooney/chest-xray-pneumonia"


def download_dataset(data_dir: str | Path = "data") -> Path:
    """Download the Kaggle Chest X-Ray Pneumonia dataset if needed."""
    data_dir = Path(data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)

    target_dir = data_dir / "chest_xray"
    if target_dir.exists():
        return target_dir

    dataset_path = kagglehub.dataset_download(DEFAULT_KAGGLE_DATASET)
    dataset_path = Path(dataset_path)

    # KaggleHub returns a path containing the dataset contents.
    # Ensure the expected directory is copied into data/.
    if (dataset_path / "chest_xray").exists():
        source_dir = dataset_path / "chest_xray"
    else:
        source_dir = dataset_path

    if target_dir.exists():
        return target_dir

    target_dir.mkdir(parents=True, exist_ok=True)
    for item in source_dir.iterdir():
        destination = target_dir / item.name
        if destination.exists():
            continue
        if item.is_dir():
            destination.mkdir(parents=True, exist_ok=True)
            for sub_item in item.rglob("*"):
                if sub_item.is_dir():
                    continue
                rel_path = sub_item.relative_to(item)
                rel_dest = destination / rel_path
                rel_dest.parent.mkdir(parents=True, exist_ok=True)
                rel_dest.write_bytes(sub_item.read_bytes())
        else:
            destination.write_bytes(item.read_bytes())
    return target_dir


def build_transforms(image_size: int = 224) -> Tuple[transforms.Compose, transforms.Compose]:
    """Create train and validation transforms."""
    train_transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(10),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225]),
        ]
    )
    val_transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225]),
        ]
    )
    return train_transform, val_transform


def create_dataloaders(
    data_dir: str | Path,
    batch_size: int = 16,
    num_workers: int = 2,
    image_size: int = 224,
) -> Tuple[DataLoader, DataLoader, DataLoader]:
    """Create dataloaders for train, validation, and test splits."""
    data_dir = Path(data_dir)
    train_transform, val_transform = build_transforms(image_size=image_size)

    train_dataset = datasets.ImageFolder(data_dir / "train", transform=train_transform)
    val_dataset = datasets.ImageFolder(data_dir / "val", transform=val_transform)
    test_dataset = datasets.ImageFolder(data_dir / "test", transform=val_transform)

    return (
        DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers),
        DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers),
        DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers),
    )


def load_image(image_path: str | Path, image_size: int = 224) -> Image.Image:
    """Load and resize a single image."""
    image = Image.open(image_path).convert("RGB")
    return image.resize((image_size, image_size))

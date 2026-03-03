"""Model and Grad-CAM utilities."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict

import torch
from torch import nn
from torchvision import models


@dataclass
class ModelConfig:
    num_classes: int = 2
    pretrained: bool = True


def build_model(config: ModelConfig) -> nn.Module:
    """Build a ResNet-50 model for pneumonia classification."""
    model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1 if config.pretrained else None)
    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, config.num_classes)
    return model


class GradCAM:
    """Compute Grad-CAM heatmaps for a given model and target layer."""

    def __init__(self, model: nn.Module, target_layer: nn.Module) -> None:
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self._register_hooks()

    def _register_hooks(self) -> None:
        def forward_hook(_, __, output):
            self.activations = output.detach()

        def backward_hook(_, grad_input, grad_output):
            self.gradients = grad_output[0].detach()

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate(self, input_tensor: torch.Tensor, class_idx: int) -> torch.Tensor:
        """Generate a Grad-CAM heatmap for a single input tensor."""
        self.model.zero_grad(set_to_none=True)
        logits = self.model(input_tensor)
        score = logits[:, class_idx].sum()
        score.backward(retain_graph=True)

        weights = self.gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * self.activations).sum(dim=1, keepdim=True)
        cam = torch.relu(cam)
        cam = torch.nn.functional.interpolate(cam, size=input_tensor.shape[2:], mode="bilinear", align_corners=False)
        cam = cam.squeeze(0).squeeze(0)
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        return cam


def get_target_layer(model: nn.Module) -> nn.Module:
    """Return the target layer for Grad-CAM (last ResNet block)."""
    return model.layer4[-1]


def load_checkpoint(model: nn.Module, checkpoint_path: str) -> Dict[str, torch.Tensor]:
    """Load model weights from a checkpoint."""
    checkpoint = torch.load(checkpoint_path, map_location="cpu")
    model.load_state_dict(checkpoint["model_state_dict"])
    return checkpoint

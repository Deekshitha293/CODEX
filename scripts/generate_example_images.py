"""Generate example images for README demonstration."""
from pathlib import Path
import random

from PIL import Image

from src.infer import overlay_heatmap


output_dir = Path("outputs")
output_dir.mkdir(parents=True, exist_ok=True)

width, height = 224, 224
base_image = Image.new("RGB", (width, height))
pixels = []
for _ in range(width * height):
    pixels.append((random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
base_image.putdata(pixels)

heatmap = [random.random() for _ in range(width * height)]
heatmap = [heatmap[i * width:(i + 1) * width] for i in range(height)]

input_image = base_image
output_image = overlay_heatmap(input_image, heatmap)

input_path = output_dir / "example_input.png"
output_path = output_dir / "example_heatmap.png"

input_image.save(input_path)
output_image.save(output_path)

print(f"Saved {input_path} and {output_path}")

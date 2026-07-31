import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src = "/tmp/newavatar.webp"
img = Image.open(src).convert("RGBA")
arr = np.array(img)
rgb = arr[:, :, :3].astype(np.int16)

r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
mx = rgb.max(axis=2)
mn = rgb.min(axis=2)

# background-like: bright and low saturation (white / light grey)
bg_like = (mn > 190) & ((mx - mn) < 30)

# label connected components; keep those touching the border
labels, n = ndimage.label(bg_like)
border_labels = set(labels[0, :]) | set(labels[-1, :]) | set(labels[:, 0]) | set(labels[:, -1])
border_labels.discard(0)

bg_mask = np.isin(labels, list(border_labels))

# alpha: 0 where background, 255 elsewhere
alpha = np.where(bg_mask, 0, 255).astype(np.uint8)

# feather edges a touch to avoid hard halo
alpha_img = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(1.2))
arr[:, :, 3] = np.array(alpha_img)

out = Image.fromarray(arr, mode="RGBA")

# crop to non-transparent bounding box with small padding
ys, xs = np.where(np.array(alpha_img) > 10)
if len(xs) and len(ys):
    x0, x1 = max(xs.min() - 20, 0), min(xs.max() + 20, out.width)
    y0, y1 = max(ys.min() - 20, 0), min(ys.max() + 20, out.height)
    out = out.crop((x0, y0, x1, y1))

# downscale to a reasonable web size (max 900px wide)
if out.width > 900:
    ratio = 900 / out.width
    out = out.resize((900, int(out.height * ratio)), Image.LANCZOS)

out.save("/app/frontend/public/avatar.png", optimize=True)
print("done", out.size)

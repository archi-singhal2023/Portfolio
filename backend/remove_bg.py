import numpy as np
from PIL import Image, ImageFilter
from rembg import remove, new_session

src = "/tmp/newavatar.webp"
img = Image.open(src).convert("RGBA")

# High-quality matting with alpha matting for clean, soft edges
session = new_session("isnet-general-use")
out = remove(
    img,
    session=session,
    alpha_matting=True,
    alpha_matting_foreground_threshold=250,
    alpha_matting_background_threshold=20,
    alpha_matting_erode_size=6,
)

arr = np.array(out)  # RGBA
alpha = arr[:, :, 3]

# gently smooth the alpha edge to avoid any residual jaggedness
alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.6))
arr[:, :, 3] = np.array(alpha_img)
out = Image.fromarray(arr, "RGBA")

# crop to subject bounding box with small padding
ys, xs = np.where(np.array(alpha_img) > 12)
if len(xs) and len(ys):
    x0, x1 = max(int(xs.min()) - 16, 0), min(int(xs.max()) + 16, out.width)
    y0, y1 = max(int(ys.min()) - 16, 0), min(int(ys.max()) + 16, out.height)
    out = out.crop((x0, y0, x1, y1))

# downscale for web
if out.width > 900:
    ratio = 900 / out.width
    out = out.resize((900, int(out.height * ratio)), Image.LANCZOS)

out.save("/app/frontend/public/avatar.png", optimize=True)
print("done", out.size)

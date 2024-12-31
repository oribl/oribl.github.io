from PIL import Image, ImageSequence
import numpy as np
from tqdm import tqdm

def atkinson_dither(image, colors, frame_number, has_alpha=False):
    width, height = image.size
    if has_alpha:
        rgba = np.array(image.convert('RGBA'))
        pixels = rgba[:, :, 0]  # Use the red channel for grayscale conversion
        alpha = rgba[:, :, 3]
    else:
        pixels = np.array(image.convert('L'))  # Convert image to grayscale
        alpha = None

    threshold_map = np.array(colors)  # Convert colors to numpy array for quick access
    quant_errors = np.zeros_like(pixels, dtype=np.float32)

    for y in tqdm(range(height), desc=f'Dithering frame {frame_number}', leave=False):
        for x in range(width):
            old_pixel = pixels[y, x] + quant_errors[y, x]
            new_pixel = threshold_map[np.argmin(np.abs(threshold_map - old_pixel))]
            pixels[y, x] = new_pixel
            quant_error = old_pixel - new_pixel

            if x + 1 < width:
                quant_errors[y, x + 1] += quant_error * 1 / 8
            if x + 2 < width:
                quant_errors[y, x + 2] += quant_error * 1 / 8
            if y + 1 < height:
                if x - 1 >= 0:
                    quant_errors[y + 1, x - 1] += quant_error * 1 / 8
                quant_errors[y + 1, x] += quant_error * 1 / 8
                if x + 1 < width:
                    quant_errors[y + 1, x + 1] += quant_error * 1 / 8
            if y + 2 < height:
                quant_errors[y + 2, x] += quant_error * 1 / 8

    dithered_image = Image.fromarray(pixels.astype(np.uint8))
    if has_alpha:
        dithered_image.putalpha(Image.fromarray(alpha))

    return dithered_image

def convert_to_two_colors(image, colors):
    color1, color2 = [Image.new('RGBA', image.size, color) for color in colors]
    if image.mode == 'RGBA':
        gray_image = image.convert('L')
        mask = gray_image.point(lambda p: 255 if p > 127 else 0, mode='1')
    else:
        mask = image.point(lambda p: 255 if p > 127 else 0, mode='1')
    
    result_image = Image.composite(color2, color1, mask)
    
    if image.mode == 'RGBA':
        result_image.putalpha(image.split()[-1])  # Preserve the alpha channel
    
    return result_image

def process_image(image_path, output_path):
    colors = [255, 0]  # Using grayscale for error diffusion
    color_map = ['#FFFEDB', '#303001']

    image = Image.open(image_path)
    has_alpha = image.mode in ('RGBA', 'LA')

    if image.format == 'GIF':
        frames = []
        total_frames = sum(1 for _ in ImageSequence.Iterator(image))
        
        for frame_number, frame in enumerate(tqdm(ImageSequence.Iterator(image), desc='Processing GIF frames', total=total_frames)):
            frame = frame.convert('RGBA' if has_alpha else 'RGB')
            dithered_frame = atkinson_dither(frame, colors, frame_number, has_alpha=has_alpha)
            dithered_frame = convert_to_two_colors(dithered_frame, color_map)
            frames.append(dithered_frame)

        frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=image.info.get('duration', 100))
    else:
        dithered_image = atkinson_dither(image.convert('RGBA' if has_alpha else 'RGB'), colors, frame_number=0, has_alpha=has_alpha)
        dithered_image = convert_to_two_colors(dithered_image, color_map)
        dithered_image.save(output_path)

if __name__ == "__main__":
    input_path = 'dither_lungs.gif'  # Change to your input file
    output_path = 'pipette_dither_v7.gif'  # Change to your desired output file
    process_image(input_path, output_path)

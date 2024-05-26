from PIL import Image, ImageSequence
import numpy as np
from tqdm import tqdm
from numba import jit, njit

@njit
def pixel_distance(pixel, color):
    return np.sum((pixel - color) ** 2)

@jit(nopython=True)
def atkinson_dither(image, colors):
    height, width = image.shape[:2]
    channel_count = image.shape[2]
    for y in range(height):
        for x in range(width):
            old_pixel = image[y, x]
            distances = np.array([pixel_distance(old_pixel, c) for c in colors])
            new_pixel_idx = np.argmin(distances)
            new_pixel = colors[new_pixel_idx].astype(image.dtype)
            image[y, x] = new_pixel
            quant_error = old_pixel - new_pixel
            if x + 1 < width:
                image[y, x + 1] = np.clip(image[y, x + 1] + quant_error * 1 / 8, 0, 255)
            if x + 2 < width:
                image[y, x + 2] = np.clip(image[y, x + 2] + quant_error * 1 / 8, 0, 255)
            if y + 1 < height:
                if x - 1 >= 0:
                    image[y + 1, x - 1] = np.clip(image[y + 1, x - 1] + quant_error * 1 / 8, 0, 255)
                image[y + 1, x] = np.clip(image[y + 1, x] + quant_error * 1 / 8, 0, 255)
                if x + 1 < width:
                    image[y + 1, x + 1] = np.clip(image[y + 1, x + 1] + quant_error * 1 / 8, 0, 255)
            if y + 2 < height:
                image[y + 2, x] = np.clip(image[y + 2, x] + quant_error * 1 / 8, 0, 255)
    return image

def convert_to_two_colors(image, colors):
    mask = np.sum(image, axis=2) > 127 * 3
    return np.where(mask[..., np.newaxis], colors[1], colors[0])

def process_image(image_path, output_path):
    colors = [np.array([255, 255, 255]), np.array([0, 0, 0])]  # White and black

    image = Image.open(image_path)
    if image.format == 'GIF':
        frames = []
        total_frames = sum(1 for _ in ImageSequence.Iterator(image))
        for frame_number, frame in enumerate(tqdm(ImageSequence.Iterator(image), desc='Processing GIF frames', total=total_frames)):
            frame = np.array(frame)
            dithered_frame = atkinson_dither(frame, colors)
            dithered_frame = convert_to_two_colors(dithered_frame, colors)
            frames.append(Image.fromarray(dithered_frame.astype('uint8')))

        frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=image.info['duration'])
    else:
        image = np.array(image)
        dithered_image = atkinson_dither(image, colors)
        dithered_image = convert_to_two_colors(dithered_image, colors)
        Image.fromarray(dithered_image.astype('uint8')).save(output_path)

if __name__ == "__main__":
    input_path = 'dither_Simulathe.gif'  # Change to your input file
    output_path = 'test3.gif'  # Change to your desired output file
    process_image(input_path, output_path)
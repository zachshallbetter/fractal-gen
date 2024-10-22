/**
 * @module models/mandelbrotModel
 * @description Generates the Mandelbrot set.
 * @since 1.0.8
 */

export function mandelbrot(params) {
  const { width = 800, height = 600, maxIterations = 1000 } = params;
  const data = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let zx = 0;
      let zy = 0;
      const cx = (x / width) * 3.5 - 2.5;
      const cy = (y / height) * 2 - 1;
      let iteration = 0;

      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = xtemp;
        iteration++;
      }

      data.push({ x, y, iteration });
    }
  }

  return data;
}

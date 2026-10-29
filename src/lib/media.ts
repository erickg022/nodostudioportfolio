// Server-only: reads files from /public with sharp at build time.
import path from "node:path";
import { getImageProps } from "next/image";
import sharp from "sharp";

type Size = { width: number; height: number };

const sizeCache = new Map<string, Promise<Size>>();

/** Intrinsic size of a file in /public, read once at build time. */
export function imageSize(src: string): Promise<Size> {
  let size = sizeCache.get(src);
  if (!size) {
    size = sharp(path.join(process.cwd(), "public", src))
      .metadata()
      .then((meta) => ({ width: meta.width ?? 1, height: meta.height ?? 1 }));
    sizeCache.set(src, size);
  }
  return size;
}

/** Responsive <img> attributes (src, srcSet, sizes, width, height) via the Next image optimizer. */
export async function responsiveImage(src: string, sizes: string) {
  const { width, height } = await imageSize(src);
  const { props } = getImageProps({ src, alt: "", width, height, sizes });
  return {
    src: props.src,
    srcSet: props.srcSet,
    sizes: props.sizes,
    width,
    height,
  };
}

/** Small fixed-width <img> (index peek): 1x/2x srcset at the given display width. */
export async function fixedImage(src: string, displayWidth: number) {
  const { width, height } = await imageSize(src);
  const { props } = getImageProps({
    src,
    alt: "",
    width: displayWidth,
    height: Math.round((displayWidth * height) / width),
  });
  return { src: props.src, srcSet: props.srcSet };
}

/**
 * One optimized URL around `targetWidth` px, used for WebGL textures so the GPU
 * never receives the full-size originals (keeps mobile memory in check).
 */
export async function textureUrl(src: string, targetWidth: number) {
  const { width, height } = await imageSize(src);
  const half = Math.round(targetWidth / 2);
  const { props } = getImageProps({
    src,
    alt: "",
    width: half,
    height: Math.round((half * height) / width),
  });
  return props.src;
}

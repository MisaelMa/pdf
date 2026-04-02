const imageCache = new Map<string, ArrayBuffer>()

/**
 * Fetches an image from a URL and returns it as an ArrayBuffer.
 * Results are cached in-memory to avoid redundant network requests.
 */
export async function fetchImage(src: string): Promise<ArrayBuffer> {
  if (imageCache.has(src)) {
    return imageCache.get(src)!
  }

  if (src.startsWith('data:')) {
    const base64 = src.split(',')[1]
    if (!base64) throw new Error(`Invalid data URI: ${src}`)
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const buffer = bytes.buffer as ArrayBuffer
    imageCache.set(src, buffer)
    return buffer
  }

  const res = await fetch(src)
  if (!res.ok) throw new Error(`Failed to fetch image: ${src} (${res.status})`)
  const buffer = await res.arrayBuffer()
  imageCache.set(src, buffer)
  return buffer
}

export function clearImageCache(): void {
  imageCache.clear()
}

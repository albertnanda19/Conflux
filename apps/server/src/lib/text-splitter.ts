const DEFAULT_SIZE = 2000
const DEFAULT_OVERLAP = 400

export function splitText(
  text: string,
  options?: { size?: number; overlap?: number },
): string[] {
  const size = options?.size ?? DEFAULT_SIZE
  const overlap = options?.overlap ?? DEFAULT_OVERLAP
  const clean = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
  if (!clean) return []
  if (clean.length <= size) return [clean]

  const chunks: string[] = []
  let start = 0
  while (start < clean.length) {
    let end = Math.min(start + size, clean.length)
    if (end < clean.length) {
      const slice = clean.slice(start, end)
      const boundary = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf("\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf(" "),
      )
      if (boundary > size * 0.5) end = start + boundary + 1
    }
    const chunk = clean.slice(start, end).trim()
    if (chunk) chunks.push(chunk)
    if (end >= clean.length) break
    start = Math.max(end - overlap, start + 1)
  }
  return chunks
}

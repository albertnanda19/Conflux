// @ts-expect-error pdf-parse has no type declarations
import pdfParse from "pdf-parse"
import { extractRawText } from "mammoth"

export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
  const type = fileType.toLowerCase()
  if (type === "pdf") {
    const result = await pdfParse(buffer)
    return result.text
  }
  if (type === "docx") {
    const result = await extractRawText({ buffer })
    return result.value
  }
  if (type === "txt" || type === "csv") {
    return buffer.toString("utf8")
  }
  throw new Error(`Tipe file tidak didukung untuk ekstraksi: ${fileType}`)
}

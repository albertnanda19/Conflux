import { useState, useRef } from 'react'

interface ImportRow {
  name: string
  phone: string
  email: string
  program: string
  isValid: boolean
  error?: string
}

interface ImportContactsModalProps {
  open: boolean
  onClose: () => void
  onImport: (rows: ImportRow[]) => void
}

function parseCSV(text: string): ImportRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const header = lines[0].toLowerCase()
  const hasHeader = header.includes('nama') || header.includes('name') || header.includes('phone') || header.includes('email')
  const dataLines = hasHeader ? lines.slice(1) : lines

  return dataLines.map((line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''))
    const name = cols[0] ?? ''
    const phone = cols[1] ?? ''
    const email = cols[2] ?? ''
    const program = cols[3] ?? ''

    const errors: string[] = []
    if (!name) errors.push('Nama wajib diisi')
    if (!phone && !email) errors.push('Phone atau email wajib diisi')

    return {
      name,
      phone,
      email,
      program,
      isValid: errors.length === 0,
      error: errors.join(', '),
    }
  })
}

export function ImportContactsModal({ open, onClose, onImport }: ImportContactsModalProps) {
  const [parsed, setParsed] = useState<ImportRow[] | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setParsed(parseCSV(text))
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      handleFile(file)
    }
  }

  const handleImport = () => {
    if (!parsed) return
    const validRows = parsed.filter((r) => r.isValid)
    onImport(validRows)
    setParsed(null)
    onClose()
  }

  const handleClose = () => {
    setParsed(null)
    onClose()
  }

  const validCount = parsed?.filter((r) => r.isValid).length ?? 0
  const invalidCount = parsed ? parsed.length - validCount : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-[520px] max-h-[80vh] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-hairline">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Import Kontak CSV</h2>
              <p className="text-sm text-steel mt-0.5">Upload file CSV dengan kolom: Nama, Phone, Email, Program.</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:bg-surface hover:text-ink transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!parsed ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-brand-blue bg-brand-blue-50' : 'border-hairline hover:border-brand-blue-200'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
              <svg className="w-10 h-10 mx-auto mb-3 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-sm text-ink font-medium mb-1">Seret file CSV ke sini</p>
              <p className="text-xs text-steel">atau klik untuk memilih file</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-ink font-medium">{parsed.length} baris ditemukan</span>
                <span className="text-emerald-600">{validCount} valid</span>
                {invalidCount > 0 && (
                  <span className="text-red-600">{invalidCount} tidak valid</span>
                )}
              </div>

              <div className="max-h-[280px] overflow-y-auto rounded-lg border border-hairline">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-hairline bg-surface">
                      <th className="px-3 py-2 text-left font-medium text-steel">Status</th>
                      <th className="px-3 py-2 text-left font-medium text-steel">Nama</th>
                      <th className="px-3 py-2 text-left font-medium text-steel">Phone</th>
                      <th className="px-3 py-2 text-left font-medium text-steel">Email</th>
                      <th className="px-3 py-2 text-left font-medium text-steel">Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.slice(0, 50).map((row, i) => (
                      <tr key={i} className="border-b border-hairline last:border-b-0">
                        <td className="px-3 py-1.5">
                          {row.isValid ? (
                            <span className="text-emerald-600">✓</span>
                          ) : (
                            <span className="text-red-600" title={row.error}>✗</span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-ink">{row.name || <span className="text-red-400">—</span>}</td>
                        <td className="px-3 py-1.5 text-ink">{row.phone || <span className="text-steel">—</span>}</td>
                        <td className="px-3 py-1.5 text-ink">{row.email || <span className="text-steel">—</span>}</td>
                        <td className="px-3 py-1.5 text-ink">{row.program || <span className="text-steel">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.length > 50 && (
                  <div className="px-3 py-2 text-xs text-steel text-center border-t border-hairline">
                    Menampilkan 50 dari {parsed.length} baris
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-hairline flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={parsed ? () => setParsed(null) : handleClose}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
          >
            {parsed ? 'Pilih Ulang' : 'Batal'}
          </button>
          {parsed && (
            <button
              type="button"
              onClick={handleImport}
              disabled={validCount === 0}
              className="h-9 px-5 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {validCount} Kontak
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

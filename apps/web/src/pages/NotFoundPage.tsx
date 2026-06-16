import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-6xl font-semibold text-ink mb-4">404</h1>
        <p className="text-steel mb-6">Halaman tidak ditemukan.</p>
        <Link to="/" className="pill-button-primary inline-block">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}

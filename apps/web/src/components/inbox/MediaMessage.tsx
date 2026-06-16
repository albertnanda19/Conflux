import { useMemo } from 'react'
import { type Message } from '@/mock/inbox'

interface MediaMessageProps {
  message: Message
  isOutbound: boolean
}

export function MediaMessage({ message, isOutbound: _isOutbound }: MediaMessageProps) {
  if (message.contentType === 'image') {
    return <ImageMessage message={message} />
  }
  if (message.contentType === 'video') {
    return <VideoMessage message={message} />
  }
  if (message.contentType === 'document') {
    return <DocumentMessage message={message} />
  }
  if (message.contentType === 'audio') {
    return <AudioMessage />
  }
  if (message.contentType === 'location') {
    return <LocationMessage message={message} />
  }
  return null
}

function ImageMessage({ message }: { message: Message }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <img
        src={message.mediaUrl}
        alt={message.fileName || 'Gambar'}
        className="w-full max-w-[280px] h-auto object-cover"
        loading="lazy"
      />
      {message.content && (
        <p className="px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          {message.content}
        </p>
      )}
    </div>
  )
}

function VideoMessage({ message }: { message: Message }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="relative bg-black">
        <video
          src={message.mediaUrl}
          controls
          className="w-full max-w-[280px] h-auto"
          preload="metadata"
        />
      </div>
      {message.content && (
        <p className="px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          {message.content}
        </p>
      )}
    </div>
  )
}

function DocumentMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl min-w-[220px] bg-surface">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-blue-200">
        <svg className="w-5 h-5 text-brand-blue-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">
          {message.fileName || 'Dokumen'}
        </p>
        {message.fileSize && (
          <p className="text-xs mt-0.5 text-steel">
            {message.fileSize}
          </p>
        )}
      </div>
      <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-hairline-soft">
        <svg className="w-4 h-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    </div>
  )
}

function AudioMessage() {
  const waveHeights = useMemo(
    () => Array.from({ length: 28 }, (_, i) => (((i * 7 + 13) % 28) / 28) * 24 + 4),
    [],
  )
  const duration = useMemo(() => 10 + ((28 * 7 + 13) % 50), [])

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-blue text-white">
        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <div className="flex-1">
        <div className="h-8 rounded-full overflow-hidden bg-surface">
          <div className="h-full flex items-center px-2 gap-[2px]">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-steel/30"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
        <p className="text-[10px] mt-1 text-steel">
          0:{String(duration).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

function LocationMessage({ message }: { message: Message }) {
  const loc = message.location
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="relative h-[160px] flex items-center justify-center bg-surface">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-xs font-medium text-ink">
            {loc?.name || 'Lokasi'}
          </p>
          {loc && (
            <p className="text-[10px] mt-0.5 text-steel">
              {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>
      {message.content && (
        <p className="px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          {message.content}
        </p>
      )}
    </div>
  )
}

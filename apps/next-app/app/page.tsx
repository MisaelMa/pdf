export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: 16,
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ whiteSpace: 'nowrap', margin: 0 }}>Next.js Demo</h2>
        <span style={{ color: '#666', fontSize: 14 }}>
          PDF generated server-side via /api/pdf
        </span>
      </div>
      <iframe
        src="/api/pdf"
        title="Server-rendered PDF"
        style={{ flex: 1, border: 'none', borderRadius: 8 }}
      />
    </div>
  )
}

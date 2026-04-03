'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Playground = dynamic(() => import('./Playground'), { ssr: false })

const tabBarStyle: React.CSSProperties = { display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb', background: '#f8f9fa', padding: '0 16px' }
const tabBase: React.CSSProperties = { padding: '10px 20px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all 0.15s' }
const tabActive: React.CSSProperties = { ...tabBase, color: '#2563eb', borderBottomColor: '#2563eb' }

export default function Home() {
  const [tab, setTab] = useState<'demo' | 'playground'>('demo')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={tabBarStyle}>
        <button style={tab === 'demo' ? tabActive : tabBase} onClick={() => setTab('demo')}>Demo</button>
        <button style={tab === 'playground' ? tabActive : tabBase} onClick={() => setTab('playground')}>Playground</button>
      </div>

      {tab === 'demo' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 16, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ whiteSpace: 'nowrap', margin: 0 }}>Next.js Demo</h2>
            <span style={{ color: '#666', fontSize: 14 }}>PDF generated server-side via /api/pdf</span>
          </div>
          <iframe src="/api/pdf" title="Server-rendered PDF"
            style={{ flex: 1, border: 'none', borderRadius: 8 }} />
        </div>
      )}

      {tab === 'playground' && <Playground />}
    </div>
  )
}

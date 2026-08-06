export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 80, padding: '40px 0' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div className="h-display" style={{ fontSize: 18, marginBottom: 6 }}>VEYLOR</div>
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Where elegance meets precision.</div>
        </div>
        <div style={{ color: 'var(--ink-faint)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          © {new Date().getFullYear()} VEYLOR — All rights reserved
        </div>
      </div>
    </footer>
  )
}

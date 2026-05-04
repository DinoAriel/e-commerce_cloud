export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ededed'
    }}>
      <div style={{ textAlign: 'center', maxWidth: 600, padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐠 E-Commerce Ikan Hias API</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Backend is running successfully</p>
        
        <div style={{ 
          background: '#1a1a1a', 
          borderRadius: '12px', 
          padding: '1.5rem',
          textAlign: 'left',
          fontSize: '0.9rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#4ade80' }}>Available Endpoints:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '0.3rem 0', borderBottom: '1px solid #333' }}>
              <code style={{ color: '#60a5fa' }}>GET</code> /api/products
            </li>
            <li style={{ padding: '0.3rem 0', borderBottom: '1px solid #333' }}>
              <code style={{ color: '#60a5fa' }}>GET</code> /api/products/:id
            </li>
            <li style={{ padding: '0.3rem 0', borderBottom: '1px solid #333' }}>
              <code style={{ color: '#facc15' }}>POST</code> /api/products
            </li>
            <li style={{ padding: '0.3rem 0', borderBottom: '1px solid #333' }}>
              <code style={{ color: '#fb923c' }}>PUT</code> /api/products/:id
            </li>
            <li style={{ padding: '0.3rem 0', borderBottom: '1px solid #333' }}>
              <code style={{ color: '#f87171' }}>DELETE</code> /api/products/:id
            </li>
            <li style={{ padding: '0.3rem 0', borderBottom: '1px solid #333' }}>
              <code style={{ color: '#60a5fa' }}>GET</code> /api/categories
            </li>
            <li style={{ padding: '0.3rem 0' }}>
              <code style={{ color: '#facc15' }}>POST</code> /api/categories
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

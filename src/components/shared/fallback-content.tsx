/**
 * Fallback Content — JS 被禁用或 3D 渲染失败时显示
 * 纯语义化 HTML，零依赖，100% 可访问
 */
export const FallbackContent: React.FC = () => {
  return (
    <noscript>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          color: '#F5F5F5',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          拼<span style={{ color: '#E02D1C' }}>多多</span>
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>
          科技赋能农业 · 连接全球供应链
        </p>

        <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px' }}>
          我们的 3D 企业门户需要 JavaScript 以获得完整体验。
          <br />
          您仍可以访问以下核心功能：
        </p>

        <nav aria-label="核心导航" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="/merchant"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#E02D1C',
              color: 'white',
              borderRadius: '2rem',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            商家入驻
          </a>
          <a
            href="/investor"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #333',
              color: '#ccc',
              borderRadius: '2rem',
              textDecoration: 'none',
            }}
          >
            投资者关系
          </a>
          <a
            href="/news"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #333',
              color: '#ccc',
              borderRadius: '2rem',
              textDecoration: 'none',
            }}
          >
            新闻中心
          </a>
        </nav>
      </div>
    </noscript>
  );
};

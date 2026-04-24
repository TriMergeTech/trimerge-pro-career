
function Footer() {
  // Colors from colors.json (light theme)
  // bg: #F8FAFC, border: #E5E7EB, text: #64748B
  return (
    <div
      style={{
        width: '100%',
        background: '#F8FAFC',
        borderTop: '1px solid #E5E7EB',
        textAlign: 'center',
      }}
    >
      <span style={{ color: '#64748B', fontSize: '0.95rem' }}>
        © {new Date().getFullYear()} TriMergePro Careers. All rights reserved.
      </span>
    </div>
  );
}

export default Footer
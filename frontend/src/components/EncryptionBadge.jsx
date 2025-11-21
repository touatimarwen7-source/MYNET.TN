import Tooltip from './Tooltip';
import '../styles/badges.css';

export default function EncryptionBadge({ size = 'md', level = 'AES-256' }) {
  const sizes = {
    sm: '16px',
    md: '20px',
    lg: '24px'
  };

  return (
    <Tooltip content={`مشفر بـ ${level}`} position="top">
      <div className={`encryption-badge encryption-${size}`}>
        <span className="lock-icon" style={{ fontSize: sizes[size] }}>
          🔒
        </span>
      </div>
    </Tooltip>
  );
}

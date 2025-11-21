import Tooltip from './Tooltip';
import '../styles/badges.css';

export default function VerifiedBadge({ size = 'md', showText = true }) {
  const sizes = {
    sm: '16px',
    md: '20px',
    lg: '24px'
  };

  return (
    <Tooltip content="تم التحقق من هذا المورد" position="top">
      <div className={`verified-badge verified-${size}`}>
        <span className="verified-icon" style={{ fontSize: sizes[size] }}>
          ✓
        </span>
        {showText && <span className="verified-text">موثق</span>}
      </div>
    </Tooltip>
  );
}

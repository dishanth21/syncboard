import React, { useEffect, useState } from 'react';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
      default:
        return '#3b82f6';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div style={{
      ...toastStyle,
      backgroundColor: getBackgroundColor()
    }}>
      <span style={{ marginRight: '10px', fontSize: '18px' }}>{getIcon()}</span>
      <span>{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        style={toastCloseStyle}
      >
        ✕
      </button>
    </div>
  );
}

const toastStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  color: 'white',
  padding: '16px 20px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 2000,
  maxWidth: '300px',
  wordBreak: 'break-word'
};

const toastCloseStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: '18px',
  marginLeft: '10px',
  padding: '0',
  width: '20px',
  height: '20px'
};

export default Toast;

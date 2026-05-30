import React from 'react';

function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '20px', height: '20px', borderWidth: '2px' };
      case 'large':
        return { width: '50px', height: '50px', borderWidth: '4px' };
      case 'medium':
      default:
        return { width: '40px', height: '40px', borderWidth: '3px' };
    }
  };

  const spinnerStyle = {
    ...getSizeStyles(),
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(fullScreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 999
    } : {
      padding: '20px'
    })
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
}

export default LoadingSpinner;

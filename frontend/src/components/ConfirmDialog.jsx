import React from 'react';

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel", isDangerous = true, loading = false }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h2 style={{ margin: '0 0 15px 0', color: isDangerous ? '#ef4444' : 'white' }}>
          {title}
        </h2>
        
        <p style={{ margin: '0 0 25px 0', color: '#9ca3af', lineHeight: '1.6' }}>
          {message}
        </p>
        
        <div style={buttonContainerStyle}>
          <button
            onClick={onCancel}
            style={cancelButtonStyle}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              ...confirmButtonStyle,
              backgroundColor: isDangerous ? '#ef4444' : '#3b82f6'
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const dialogStyle = {
  background: '#1f2937',
  borderRadius: '12px',
  padding: '25px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)',
  color: 'white'
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const cancelButtonStyle = {
  padding: '10px 20px',
  background: '#6b7280',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px'
};

const confirmButtonStyle = {
  padding: '10px 20px',
  background: '#ef4444',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default ConfirmDialog;

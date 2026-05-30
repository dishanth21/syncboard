import React from 'react';

function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = "Save", cancelText = "Cancel", loading = false }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            disabled={loading}
          >
            ✕
          </button>
        </div>
        
        <div style={contentStyle}>
          {children}
        </div>
        
        <div style={footerStyle}>
          <button
            onClick={onClose}
            style={cancelButtonStyle}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={confirmButtonStyle}
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

const modalStyle = {
  background: '#1f2937',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #374151'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '0',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const contentStyle = {
  padding: '20px',
  maxHeight: '400px',
  overflowY: 'auto'
};

const footerStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  padding: '20px',
  borderTop: '1px solid #374151'
};

const confirmButtonStyle = {
  padding: '10px 20px',
  background: '#3b82f6',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px'
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

export default Modal;

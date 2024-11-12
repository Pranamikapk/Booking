import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        padding: '20px',
        background: '#fff',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '200px',
        position: 'relative',
        maxWidth: '500px',
        width: '100%'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}>×</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    // Si hay un mensaje, programamos que desaparezca en 3 segundos
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer); // Limpieza si el componente se desmonta antes
    }
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: isSuccess ? '#2e7d32' : '#d32f2f', // Verde oscuro o Rojo oscuro
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      zIndex: 9999, // Para que siempre flote por encima de todo
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '500',
      fontFamily: 'sans-serif',
      transition: 'all 0.3s ease-in-out'
    }}>
      <span style={{ fontSize: '18px' }}>{isSuccess ? '✓' : '⚠'}</span>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'none', border: 'none', color: 'white', cursor: 'pointer', 
          marginLeft: '15px', fontWeight: 'bold', padding: '0 5px' 
        }}
      >
        ✕
      </button>
    </div>
  );
}
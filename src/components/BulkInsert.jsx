import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function BulkInsert({ onBack }) {
  const { currentUser } = useContext(UserContext);
  
  // Guardamos el texto crudo del textarea
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Evitamos enviar envíos vacíos

    setLoading(true);
    setMessage(null);

    try {
      // Llamamos al servicio que creamos, pasándole la API Key del usuario actual y el texto
      const response = await issueService.bulkInsert(currentUser.apiKey, text);
      
      setMessage({ type: 'success', text: response.message || "Incidències creades correctament!" });
      setText(""); // Limpiamos el cuadro tras el éxito
      
      // Opcional: Volver al listado después de 2 segundos
      setTimeout(() => {
        if(onBack) onBack();
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Error: No s'han pogut crear les incidències. Comprova el format." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Inserció Massiva (Bulk Insert)</h2>
        <button 
          onClick={onBack} 
          style={{ padding: '5px 15px', cursor: 'pointer', background: '#ccc', border: 'none' }}
        >
          Volver a la Lista
        </button>
      </div>

      <p style={{ color: '#555' }}>
        Introdueix un títol per línia. Cada línia crearà una incidència nova amb els valors per defecte.
      </p>

      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Falta el botó de login&#10;La imatge no carrega&#10;Cal actualitzar la base de dades"
          style={{ 
            width: '100%', 
            height: '250px', 
            padding: '10px', 
            fontFamily: 'monospace',
            marginBottom: '15px',
            resize: 'vertical'
          }}
          disabled={loading}
        />
        
        <button 
          type="submit" 
          disabled={loading || !text.trim()}
          style={{ 
            background: loading ? '#ccc' : '#222', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Creant...' : 'Crear Totes les Incidències'}
        </button>
      </form>
    </div>
  );
}
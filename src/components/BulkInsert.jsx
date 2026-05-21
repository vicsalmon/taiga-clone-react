import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function BulkInsert({ onBack }) {
  const { currentUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setMessage(null);

    try {
      const response = await issueService.bulkInsert(currentUser.apiKey, text);
      setMessage({ type: 'success', text: response.message || "Creats correctament!" });
      setText("");
      setTimeout(() => { if(onBack) onBack(); }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: "Error en la inserció massiva." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel form-container">
      <div className="form-header">
        <h2>Inserció Massiva (Bulk)</h2>
        <button onClick={onBack} className="btn btn-secondary">Volver</button>
      </div>

      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Afegeix <strong>un títol per línia</strong>. El sistema crearà una incidència per cada línia amb els valors per defecte de Taiga.
      </p>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ej:&#10;Falta botó Login&#10;Error 500 en perfil&#10;Actualitzar logos"
          style={{ height: '300px', fontFamily: 'monospace', fontSize: '13px' }}
          disabled={loading}
        />
        
        <button type="submit" disabled={loading || !text.trim()} className="btn btn-neutral" style={{width: '100%', padding: '15px'}}>
          {loading ? 'Processant...' : 'Crear Totes les Incidències'}
        </button>
      </form>
    </div>
  );
}
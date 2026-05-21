import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const UserProfile = ({ userId, onBack, onShowNotification }) => {
  const { getUserNameById, currentUser } = useContext(UserContext);
  const [userApiData, setUserApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Hacemos el GET al endpoint de la API REST
        const response = await fetch(`https://taiga-app.onrender.com/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'X-Api-Key': currentUser.apiKey,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el perfil del usuario");
        }

        const data = await response.json();
        setUserApiData(data); // Guardamos la respuesta que contiene el avatar_url
      } catch (err) {
        console.error(err);
        if (onShowNotification) {
          onShowNotification("Error al cargar la imagen y datos del usuario", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, currentUser.apiKey]);

  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      {/* Botón de volver */}
      <button className="btn" onClick={onBack} style={{ marginBottom: '20px' }}>
        &larr; Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
        
        {/* COLUMNA IZQUIERDA: Sidebar del Perfil */}
        <div style={{ borderRight: '1px solid #ddd', paddingRight: '20px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: '#00b19d', color: 'white', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', 
            fontSize: '32px', fontWeight: 'bold', marginBottom: '15px',
            overflow: 'hidden' // Importante para que la imagen redonda no se salga
          }}>
            {/* LOGICA DEL ICONO/AVATAR */}
            {loading ? (
              <span style={{ fontSize: '14px' }}>...</span>
            ) : userApiData && userApiData.avatar_url ? (
              <img 
                src={userApiData.avatar_url} 
                alt={userApiData.username} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              /* Fallback: Si no hay foto o sigue cargando, muestra la inicial */
              getUserNameById(userId).charAt(0).toUpperCase()
            )}
          </div>

          <h2 style={{ margin: '0 0 5px 0' }}>
            {userApiData ? userApiData.username : getUserNameById(userId)}
          </h2>
          <p style={{ color: '#888', fontSize: '14px' }}>ID del Usuario: {userId}</p>
          {userApiData && userApiData.email && (
            <p style={{ color: '#666', fontSize: '14px' }}>{userApiData.email}</p>
          )}
        </div>

        {/* COLUMNA DERECHA: Pestañas / Contenido adicional */}
        <div>
          {userApiData && userApiData.description ? (
            <div>
              <h3>Biografía</h3>
              <p>{userApiData.description}</p>
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>Sin descripción disponible.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
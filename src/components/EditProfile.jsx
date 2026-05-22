import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';

export default function EditProfile({ userId, onBack, onShowNotification }) {
  const { currentUser, getUserNameById } = useContext(UserContext);
  
  //Estados para el formulario
  const [description, setDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  //Referencia para el input de archivo oculto
  const fileInputRef = useRef(null);

  //Cargar los datos iniciales del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://taiga-app.onrender.com/api/v1/users/${userId}`, {
          headers: {
            'X-Api-Key': currentUser.apiKey,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDescription(data.description || '');
          if (data.avatar_url) {
            setAvatarPreview(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error carregant el perfil:", error);
        onShowNotification("Error en carregar les dades del perfil", "error");
      } finally {
        setInitialLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, currentUser.apiKey, onShowNotification]);

  //Manejar la selección de la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      //Crear una URL temporal para previsualizar la imagen antes de subirla
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  //Enviar el formulario a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //Usamos FormData porque vamos a enviar un archivo (multipart/form-data)
      const formData = new FormData();
      formData.append('description', description);
      
      //Solo añadimos el archivo si el usuario ha seleccionado uno nuevo
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      //Hacemos PATCH a /profile (editar perfil)
      const response = await fetch('https://taiga-app.onrender.com/api/v1/profile', {
        method: 'PATCH',
        headers: {
          //no ponemos 'Content-Type': 'multipart/form-data' , ja que fetch() lo pone automáticamente cuando le pasas un FormData.
          'X-Api-Key': currentUser.apiKey,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        onShowNotification("Perfil actualitzat amb èxit!", "success");
        onBack(); // Volver a la vista del perfil
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        onShowNotification("Error en actualitzar el perfil", "error");
      }
    } catch (error) {
      console.error("Error de xarxa:", error);
      onShowNotification("Error de connexió amb el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  //Pantalla de carga mientras trae los datos iniciales
  if (initialLoading) {
    return <div className="text-center mt-20 text-gray-500">Carregant dades del perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Tornar"
        >
          ✕ Cancel·lar
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN FOTO DE PERFIL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Foto de Perfil
          </label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex-shrink-0 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-400 font-bold">
                  {getUserNameById(userId).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden" //Ocultamos el input feo por defecto
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors text-sm"
              >
                Canviar Imatge
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Recomanat: Imatge quadrada (JPG, PNG).
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN BIOGRAFÍA */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Biografia / Descripció
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explica'ns una mica sobre tu..."
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y"
            rows="5"
          />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-4 pt-4 border-t mt-8">
          <button 
            type="submit" 
            disabled={loading}
            className={`px-6 py-2 bg-emerald-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600'}`}
          >
            {loading ? 'Desant...' : 'Desar canvis'}
          </button>
          <button 
            type="button" 
            onClick={onBack}
            disabled={loading}
            className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel·lar
          </button>
        </div>
      </form>
    </div>
  );
}
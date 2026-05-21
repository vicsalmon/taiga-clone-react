import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function UserAvatar({ userId, onClick, size = "w-6 h-6" }) {
  const { currentUser, getUserNameById } = useContext(UserContext);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const userName = getUserNameById(userId);

  useEffect(() => {
    if (!userId) return;

    const fetchAvatar = async () => {
      try {
        const response = await fetch(`https://taiga-app.onrender.com/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'X-Api-Key': currentUser.apiKey,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error("Error carregant avatar", error);
      }
    };

    fetchAvatar();
  }, [userId, currentUser.apiKey]);

  //Si no hay avatar, usamos ui-avatars
  const imgSrc = avatarUrl || `https://ui-avatars.com/api/?name=${userName}&background=f3f4f6&color=333`;

  return (
    <img 
      src={imgSrc} 
      alt={userName}
      onClick={onClick}
      className={`${size} rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 flex-shrink-0`}
      title={`Veure perfil de ${userName}`}
    />
  );
}
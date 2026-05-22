import React, { useState, useEffect } from 'react';
import api from '../api'; 

const UserComments = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [userId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}/comments`);
      setComments(response.data);
      setLoading(false);
    } catch (err) {
      setError("No s'han pogut carregar els comentaris.");
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Segur que vols esborrar aquest comentari?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        // Filtrem la llista localment perquè desaparegui el comentari esborrat
        setComments(comments.filter(c => i.id !== commentId));
        alert("Comentari eliminat");
      } catch (err) {
        alert("Error en esborrar el comentari.");
      }
    }
  };

  if (loading) return <div className="loading">Carregant comentaris...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-comments-container">
      {comments.length === 0 ? (
        <p className="no-comments">Aquest usuari encara no ha fet cap comentari.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <span>ON ISSUE: </span>
              <a href={`/issues/${comment.issue?.id}`} className="issue-link">
                #{comment.issue?.id} {comment.issue?.subject}
              </a>
            </div>
            
            <div className="comment-body">
              "{comment.content}"
            </div>

            <div className="comment-footer">
              <span className="comment-date">
                {new Date(comment.created_at).toLocaleString('ca-ES')}
              </span>
              
              <div className="comment-actions">
                <button className="btn-edit">Edit</button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserComments;
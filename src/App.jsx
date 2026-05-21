import { useState } from 'react';
import IssueList from './components/IssueList';
import BulkInsert from './components/BulkInsert';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Estado para la notificación flotante
  const [toast, setToast] = useState({ message: '', type: '' });

  // Función global para mostrar el mensaje
  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
  };

  const goToList = () => {
    setSelectedIssue(null);
    setCurrentView('list');
  };

  const goToDetail = (id) => {
    setSelectedIssue(id);
    setCurrentView('detail');
  };

  const goToEdit = (issueObj) => {
    setSelectedIssue(issueObj);
    setCurrentView('form');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {currentView === 'list' && (
        <IssueList 
          onNavigateToBulk={() => setCurrentView('bulk')}
          onNavigateToCreate={() => { setSelectedIssue(null); setCurrentView('form'); }}
          onViewDetail={goToDetail}
          onShowNotification={showNotification}
        />
      )}

      {currentView === 'bulk' && (
        <BulkInsert 
          onBack={goToList} 
          onShowNotification={showNotification}
        />
      )}

      {currentView === 'form' && (
        <IssueForm 
          onBack={goToList} 
          issueToEdit={selectedIssue} 
          onShowNotification={showNotification} 
        />
      )}

      {currentView === 'detail' && (
        <IssueDetail
          issueId={selectedIssue}
          onBack={goToList}
          onEdit={goToEdit}
          onShowNotification={showNotification}
        />
      )}

      {/* Componente que se encarga de pintar la notificación si existe */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />

    </div>
  );
}

export default App;
import { useState } from 'react';
import IssueList from './components/IssueList';
import BulkInsert from './components/BulkInsert';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('list');
  
  // Guardamos la ID de la issue seleccionada para el detalle, o el objeto entero para editar
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Funciones de navegación
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
          onViewDetail={goToDetail} // <--- Nueva prop para la lista
        />
      )}

      {currentView === 'bulk' && (
        <BulkInsert onBack={goToList} />
      )}

      {currentView === 'form' && (
        <IssueForm 
          onBack={goToList} 
          issueToEdit={selectedIssue} // Si es null crea, si hay objeto edita
        />
      )}

      {currentView === 'detail' && (
        <IssueDetail
          issueId={selectedIssue}
          onBack={goToList}
          onEdit={goToEdit}
        />
      )}

    </div>
  );
}

export default App;
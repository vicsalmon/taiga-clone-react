import { useState } from 'react';
import IssueList from './components/IssueList';
import BulkInsert from './components/BulkInsert';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import SettingsPanel from './components/SettingsPanel';
import Toast from './components/Toast';
import './App.css';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '' });

  const [selectedProfileId, setSelectedProfileId] = useState(null);

  const goToProfile = (userId) => {
    setSelectedProfileId(userId);
    setCurrentView('profile');
  };

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
          onNavigateToSettings={() => setCurrentView('settings')}
          onViewDetail={goToDetail}
          onShowNotification={showNotification}
          onNavigateToProfile={goToProfile}
        />
      )}

      {currentView === 'bulk' && (
        <BulkInsert
          onBack={goToList}
          onShowNotification={showNotification}
          onNavigateToProfile={goToProfile}
        />
      )}

      {currentView === 'form' && (
        <IssueForm
          onBack={goToList}
          issueToEdit={selectedIssue}
          onShowNotification={showNotification}
          onNavigateToProfile={goToProfile}
        />
      )}

      {currentView === 'detail' && (
        <IssueDetail
          issueId={selectedIssue}
          onBack={goToList}
          onEdit={goToEdit}
          onShowNotification={showNotification}
          onNavigateToProfile={goToProfile}
        />
      )}

      {currentView === 'settings' && (
        <SettingsPanel
          onBack={goToList}
          onShowNotification={showNotification}
          onNavigateToProfile={goToProfile}
        />
      )}

      {currentView === 'profile' && (
        <UserProfile
          userId={selectedProfileId}
          onBack={goToList}
          onShowNotification={showNotification}
          onNavigateToProfile={goToProfile}
          onNavigateToEdit={() => setCurrentView('EDIT_PROFILE')}
        />
      )}

      {currentView === 'EDIT_PROFILE' && (
        <EditProfile 
          userId={selectedProfileId} 
          onBack={() => setCurrentView('profile')} 
          onShowNotification={showNotification} 
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />

    </div>
  );
}

export default App;

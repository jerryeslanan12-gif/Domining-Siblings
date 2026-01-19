import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Messenger from './components/Messenger';
import FamilyTree from './components/FamilyTree';
import Emergency from './components/Emergency';
import Goals from './components/Goals';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Settings from './pages/Settings';
import WisdomPopup from './components/WisdomPopup';
import Meetings from './components/Meetings';
import Research from './components/Research';
import InstallPrompt from './components/InstallPrompt';
import Splash from './components/Splash';
import BottomNav from './components/BottomNav';
import { useStore } from './services/store';
import { format } from 'date-fns';

import { motion, AnimatePresence } from 'framer-motion';

const isUserOnline = (lastSeen) => lastSeen && (Date.now() - lastSeen < 30000);

function Layout({ user, onlineUsers, allUsers, store, searchQuery, setSearchQuery }) {
  const onlineList = allUsers.filter(u => u.id !== user.id && isUserOnline(onlineUsers[u.id]));

  const [emergencyActive, setEmergencyActive] = useState(false);



  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync Queue when detected online
  useEffect(() => {
    if (isOnline) {
      console.log("App is online: Attempting to sync offline queue...");
      // Slight delay to ensure connection is stable
      setTimeout(() => {
        store.processQueue();
      }, 1000);
    }
  }, [isOnline]);

  return (
    <>
      <Navbar user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container app-grid">
        <div className="sidebar-wrapper">
          <Sidebar user={user} />
        </div>

        <main style={{ minWidth: 0 }}>
          <Outlet context={{ searchQuery }} />
        </main>

        <div className="right-sidebar" style={{ display: 'none' /* Responsive handled in grid */ }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: 'white' }}>Online Family</h3>
            {onlineList.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Everyone is resting.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {onlineList.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={u.avatar} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#31a24c', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.5)' }}></div>
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'white' }}>{u.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>System Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: '10px', height: '10px', background: isOnline ? '#3b82f6' : '#ef4444', borderRadius: '50%' }}
              />
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: isOnline ? '#60a5fa' : '#fda4af' }}>
                {isOnline ? 'PC Server Connected' : 'Offline Mode'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>
              {isOnline ? 'Data syncing with master node.' : 'Changes queued locally.'}
            </p>
          </div>
        </div>
      </div>

      {/* Floating SOS Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setEmergencyActive(true)}
        className="sos-floating-btn"
        style={{
          position: 'fixed', bottom: '30px', right: '30px',
          width: '70px', height: '70px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5)',
          border: '4px solid rgba(255,255,255,0.1)',
          color: 'white', fontWeight: '800', fontSize: '18px',
          zIndex: 9000, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        SOS
      </motion.button>

      <Emergency active={emergencyActive} setActive={setEmergencyActive} />

      <ServerStatus isOnline={isOnline} />

      {store.settings.wisdomPopup && <WisdomPopup />}
      <InstallPrompt />



      <style>{`
         /* Right sidebar manual styles if needed, though mostly handled by grid and glass classes now */
         .right-sidebar { display: flex; flex-direction: column; }
         @media(max-width: 1100px) { .right-sidebar { display: none !important; } }
      `}</style>
      <BottomNav user={user} />
    </>
  );
}

function ServerStatus({ isOnline }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show notification on state change
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [isOnline]);

  if (!visible && isOnline) return null; // Hide after timeout if online (unintrusive)
  // Keep visible if offline to warn user? Or just flash? 
  // User requested "notify every user if the server was on or off"

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: isOnline ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        padding: '12px 24px', borderRadius: '30px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: '10px',
        fontWeight: '600', fontSize: '14px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: isOnline ? '#fff' : '#fff',
        boxShadow: isOnline ? '0 0 10px #fff' : 'none'
      }}></div>
      {isOnline ? 'Server Online: Syncing Data...' : 'Server Offline: Changes saved to device.'}
    </motion.div>
  );
}

function App() {
  const store = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ds_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => { store.updateHeartbeat(user.id); }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Sync theme from store on mount
    const savedSettings = localStorage.getItem('ds_settings');
    if (savedSettings) {
      try {
        const { theme } = JSON.parse(savedSettings);
        if (theme) document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Sync user state with storage updates
    const handleStorageUpdate = () => {
      const saved = localStorage.getItem('ds_current_user');
      // Only update if changed
      const parsed = saved ? JSON.parse(saved) : null;
      if (JSON.stringify(parsed) !== JSON.stringify(user)) {
        setUser(parsed);
      }
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, [user]);

  const handleLogin = (u) => {
    const freshUser = store.login(u);
    setUser(freshUser);
  };

  const handleLogout = () => {
    if (user) {
      store.logout(user.id);
      setUser(null);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />

        <Route element={user ? <Layout user={user} onlineUsers={store.online} allUsers={store.users} store={store} searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> : <Navigate to="/login" />}>
          <Route path="/" element={<Feed user={user} store={store} searchQuery={searchQuery} />} />
          <Route path="/profile/:id" element={<Profile user={user} store={store} onLogout={handleLogout} />} />
          <Route path="/messages" element={<Messenger user={user} store={store} />} />
          <Route path="/family-tree" element={<FamilyTree user={user} store={store} />} />
          <Route path="/goals" element={<Goals user={user} store={store} />} />
          <Route path="/meetings" element={<Meetings user={user} store={store} />} />
          <Route path="/research" element={<Research user={user} store={store} />} />
          <Route path="/settings" element={<Settings user={user} store={store} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

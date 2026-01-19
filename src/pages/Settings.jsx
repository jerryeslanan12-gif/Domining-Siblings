import React, { useState } from 'react';
import { Moon, Sun, Monitor, Check, Bell, Shield, Sparkles, LogOut, User, Users, Lock, Wifi, Smartphone, Globe, AlertTriangle, ChevronRight, Layout, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings({ store }) {
    const currentSettings = store.settings || {};
    const [activeTab, setActiveTab] = useState('general');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const currentUser = store.users.find(u => u.id === store.settings?.userId) || {};
    const tabs = [
        { id: 'general', label: 'General', icon: Layout },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'account', label: 'Account', icon: User },
        ...(currentUser.isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Lock }] : [])
    ];

    const themes = [
        { id: 'dark', name: 'Midnight', color: '#3b82f6', bg: '#0f172a' },
        { id: 'light', name: 'Daybreak', color: '#f59e0b', bg: '#f8fafc' },
        { id: 'forest', name: 'Evergreen', color: '#10b981', bg: '#022c22' },
        { id: 'crimson', name: 'Velvet', color: '#ef4444', bg: '#450a0a' },
    ];

    const updateSetting = (key, value) => {
        store.updateSettings({ [key]: value });
        if (key === 'theme') {
            document.documentElement.setAttribute('data-theme', value);
        }
    };



    return (
        <div className="container" style={{ maxWidth: '1000px', paddingBottom: '100px', color: 'white', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px' }}
            >
                <h1 style={{ fontSize: '3rem', fontWeight: '900', background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>Settings</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Personalize your experience.</p>
            </motion.div>

            <div className="settings-grid">
                {/* Tabs Sidebar */}
                <div className="tabs-sidebar" style={{ position: 'sticky', top: '120px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            data-active={activeTab === tab.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '15px 20px',
                                background: activeTab === tab.id ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent)' : 'transparent',
                                border: 'none', borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                                color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
                                fontSize: '16px', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
                                transition: '0.3s', borderRadius: '0 12px 12px 0',
                                whiteSpace: 'nowrap', flexShrink: 0
                            }}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ position: 'relative', minHeight: '500px', maxWidth: '100%', overflowX: 'hidden' }}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            style={{ maxWidth: '100%' }} // Ensure content fits
                        >
                            {activeTab === 'general' && (
                                <div>
                                    <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Interface & Experience</h2>

                                    <div className="card-premium" style={{ marginBottom: '25px' }}>
                                        <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#94a3b8' }}>Theme Selection</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                                            {themes.map(t => (
                                                <div
                                                    key={t.id}
                                                    onClick={() => updateSetting('theme', t.id)}
                                                    style={{
                                                        background: currentSettings.theme === t.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                                                        border: currentSettings.theme === t.id ? '2px solid #3b82f6' : '2px solid transparent',
                                                        borderRadius: '16px', padding: '15px', cursor: 'pointer',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                                        transition: '0.3s'
                                                    }}
                                                >
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.color, boxShadow: `0 5px 15px ${t.color}66` }}></div>
                                                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{t.name}</span>
                                                    {currentSettings.theme === t.id && <div style={{ fontSize: '12px', color: '#3b82f6' }}>Active</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <SettingRow icon={Sparkles} title="Daily Wisdom" description="Show inspirational quotes on launch">
                                        <Toggle toggled={currentSettings.wisdomPopup !== false} onToggle={(v) => updateSetting('wisdomPopup', v)} />
                                    </SettingRow>

                                    <SettingRow icon={Layout} title="Compact Mode" description="Reduce spacing for higher density">
                                        <Toggle toggled={currentSettings.compactMode || false} onToggle={(v) => updateSetting('compactMode', v)} />
                                    </SettingRow>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div>
                                    <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Notification Preferences</h2>
                                    <SettingRow icon={Bell} title="Push Notifications" description="Receive alerts on this device">
                                        <Toggle toggled={currentSettings.notifications !== false} onToggle={(v) => updateSetting('notifications', v)} />
                                    </SettingRow>
                                    <SettingRow icon={Globe} title="Email Digest" description="Weekly summary of family activity">
                                        <Toggle toggled={currentSettings.emailAlerts || false} onToggle={(v) => updateSetting('emailAlerts', v)} />
                                    </SettingRow>
                                    <SettingRow icon={Users} title="Family Updates" description="Get notified when family posts">
                                        <Toggle toggled={currentSettings.familyUpdates !== false} onToggle={(v) => updateSetting('familyUpdates', v)} />
                                    </SettingRow>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div>
                                    <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Privacy & Security</h2>
                                    <SettingRow icon={NavigationIcon} title="Location Services" description="Allow family to see your location">
                                        <Toggle toggled={currentSettings.locationServices !== false} onToggle={(v) => updateSetting('locationServices', v)} />
                                    </SettingRow>

                                    <div style={{ height: '20px' }} />

                                    <SettingRow icon={Key} title="Change Password" description="Update your login credentials">
                                        <button className="btn-secondary">Update</button>
                                    </SettingRow>
                                    <SettingRow icon={Smartphone} title="Two-Factor Auth" description="Add an extra layer of security">
                                        <button className="btn-secondary">Configure</button>
                                    </SettingRow>
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <div>
                                    <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Account Management</h2>

                                    <div className="card-premium">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 'bold' }}>
                                                {currentUser.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '20px', margin: 0 }}>Current Session</h3>
                                                <p style={{ color: '#94a3b8', margin: '5px 0' }}>Manage your session and data.</p>
                                                {currentUser.isAdmin && <span style={{ background: '#f59e0b', color: 'black', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>MASTER ADMIN</span>}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { localStorage.removeItem('ds_current_user'); window.location.reload(); }}
                                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifySelf: 'center', gap: '10px', justifyContent: 'center' }}
                                        >
                                            <LogOut size={20} /> Sign Out
                                        </button>
                                    </div>

                                    <div style={{ marginTop: '30px', padding: '25px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                            <AlertTriangle size={20} /> Danger Zone
                                        </h3>
                                        <p style={{ color: '#fca5a5', fontSize: '14px', marginBottom: '20px' }}>
                                            Deleting your account is permanent. All your data will be wiped from the local family node.
                                        </p>

                                        {!confirmDelete ? (
                                            <button
                                                onClick={() => setConfirmDelete(true)}
                                                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                Delete Account
                                            </button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <button
                                                    onClick={() => setConfirmDelete(false)}
                                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        alert("Account deletion simulated.");
                                                        setConfirmDelete(false);
                                                        localStorage.removeItem('ds_current_user');
                                                        window.location.reload();
                                                    }}
                                                    style={{ background: '#b91c1c', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    Confirm Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'admin' && currentUser.isAdmin && (
                                <div>
                                    <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Admin Panel</h2>
                                    <div className="card-premium">
                                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Users size={20} /> Manage Users
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {store.users.map(u => (
                                                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img src={u.avatar || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                        <div>
                                                            <div style={{ fontWeight: 'bold' }}>{u.name} {u.id === currentUser.id && '(You)'}</div>
                                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</div>
                                                        </div>
                                                    </div>
                                                    {u.id !== currentUser.id && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Are you sure you want to remove ${u.name}?`)) {
                                                                    store.deleteUser(u.id);
                                                                }
                                                            }}
                                                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <Wifi size={24} color="#34d399" />
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#34d399' }}>Tunnel Status</div>
                                            <div style={{ fontSize: '13px', color: '#a7f3d0' }}>The app is being broadcasted securely. No password required for family access if using localtunnel or similar free tiers.</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .btn-secondary { background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-secondary:hover { background: rgba(255,255,255,0.2); }
                .settings-grid { display: grid; grid-template-columns: 250px 1fr; gap: 40px; alignItems: start; }
                @media (max-width: 768px) {
                    .container { padding: 15px !important; }
                    .settings-grid { grid-template-columns: 1fr; gap: 20px; }
                    .tabs-sidebar { 
                        display: flex; overflow-x: auto; padding-bottom: 5px; position: static !important; 
                        margin-bottom: 20px; white-space: nowrap; -webkit-overflow-scrolling: touch;
                    }
                    .tabs-sidebar button { 
                        border-left: none !important; border-bottom: 3px solid transparent; 
                        border-radius: 12px; padding: 10px 15px; background: rgba(255,255,255,0.05) !important;
                        margin-right: 10px;
                    }
                    .tabs-sidebar button[data-active="true"] {
                         border-bottom: 3px solid #3b82f6 !important; background: rgba(59, 130, 246, 0.1) !important;
                         color: #3b82f6 !important;
                    }
                    h1 { font-size: 2rem !important; }
                }
            `}</style>
        </div>
    );
}

const Toggle = ({ toggled, onToggle }) => (
    <div
        onClick={() => onToggle(!toggled)}
        style={{
            width: '56px', height: '32px', background: toggled ? '#3b82f6' : 'rgba(255,255,255,0.1)',
            borderRadius: '30px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
            border: '1px solid rgba(255,255,255,0.1)'
        }}
    >
        <motion.div
            layout
            animate={{ x: toggled ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
                width: '24px', height: '24px', background: 'white', borderRadius: '50%',
                position: 'absolute', top: '3px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
        />
    </div>
);

const SettingRow = ({ icon: Icon, title, description, children, danger }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: danger ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.03)', borderRadius: '20px', marginBottom: '15px', border: danger ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: danger ? '#ef4444' : 'white' }}>
                <Icon size={20} />
            </div>
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: danger ? '#ef4444' : 'white' }}>{title}</div>
                {description && <div style={{ fontSize: '13px', color: danger ? '#fca5a5' : '#94a3b8', marginTop: '2px' }}>{description}</div>}
            </div>
        </div>
        <div>{children}</div>
    </div>
);

// Helper icon
const NavigationIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);

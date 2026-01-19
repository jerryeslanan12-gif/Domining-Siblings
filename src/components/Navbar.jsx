import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, Bell, Search, Target, Settings as SettingsIcon } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery }) {
    const location = useLocation();

    return (
        <nav className="glass-panel main-navbar" style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', background: 'transparent',
                        borderRadius: '12px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', overflow: 'hidden'
                    }}>
                        <img src="/app-icon.png" alt="Domining Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span className="app-name-text" style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>Domining</span>
                </Link>
                <div className="glass-input-wrapper" style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                    <input
                        className="glass-input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '40px', width: '220px', borderRadius: '50px' }}
                    />
                </div>
            </div>

            <div className="nav-center" style={{ display: 'flex', gap: '8px' }}>
                <NavIcon to="/" icon={<Home size={24} />} active={location.pathname === '/'} />
                <NavIcon to="/messages" icon={<MessageCircle size={24} />} active={location.pathname === '/messages'} />
                <NavIcon to="/family-tree" icon={<Users size={24} />} active={location.pathname === '/family-tree'} />
                <NavIcon to="/meetings" icon={<Target size={24} />} active={location.pathname === '/meetings'} />
            </div>

            <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/settings" style={{ color: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '12px', transition: '0.2s' }}>
                    <SettingsIcon size={24} />
                </Link>
                <div className="nav-profile-trigger">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }}
                    />
                </div>
            </div>
        </nav>
    );
}

function NavIcon({ to, icon, active }) {
    return (
        <Link to={to} style={{ position: 'relative', padding: '12px 24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ color: active ? 'white' : 'rgba(255,255,255,0.4)', transition: '0.3s', zIndex: 2 }}>{icon}</div>
            {active && (
                <div
                    style={{
                        position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.1)',
                        borderRadius: '16px', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)'
                    }}
                />
            )}
        </Link>
    )
}

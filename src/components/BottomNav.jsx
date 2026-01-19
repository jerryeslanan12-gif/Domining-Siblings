import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Users, GraduationCap, User, Settings } from 'lucide-react';

export default function BottomNav({ user }) {
    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Chat', icon: MessageCircle, path: '/messages' },
        { label: 'Hub', icon: GraduationCap, path: '/research' },
        { label: 'Family', icon: Users, path: '/family-tree' },
        { label: 'Settings', icon: Settings, path: '/settings' },
        { label: 'Profile', icon: User, path: user ? `/profile/${user.id}` : '/login' },
    ];

    return (
        <div className="bottom-nav-wrapper">
            <nav className="glass-panel" style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '400px',
                padding: '0 20px',
                height: '70px',
                borderRadius: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 1000,
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)'
            }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            color: 'rgba(255,255,255,0.5)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <div style={{
                                    background: isActive ? 'var(--primary)' : 'transparent',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    transition: 'all 0.3s',
                                    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.5)' : 'none'
                                }}>
                                    <item.icon size={20} color={isActive ? 'white' : 'currentColor'} />
                                </div>
                                {/* <span style={{ fontSize: '10px', fontWeight: '500', opacity: isActive ? 1 : 0.7 }}>{item.label}</span> */}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            <style>{`
        .bottom-nav-wrapper { display: none; }
        @media (max-width: 900px) {
            .bottom-nav-wrapper { display: block; }
            .bottom-nav-item.active { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}

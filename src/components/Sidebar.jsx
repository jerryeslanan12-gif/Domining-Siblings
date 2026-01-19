import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle, Users, Settings, Target, GraduationCap } from 'lucide-react';

export default function Sidebar({ user }) {
    const location = useLocation();
    const menuItems = [
        { label: 'Feed', icon: Home, path: '/' },
        { label: 'Profile', icon: User, path: user ? `/profile/${user.id}` : '/login' },
        { label: 'Messages', icon: MessageCircle, path: '/messages' },
        { label: 'Family Tree', icon: Users, path: '/family-tree' },
        { label: 'Goals', icon: Target, path: '/meetings' }, // Note: /meetings seems to be used for "Goals" in the UI label previously, but mapped to Goals component? Or Meetings component? 
        // Wait, line 12 says "Goals" icon Target path /meetings. That's confusing.
        // Actually, App.jsx says: path="/goals" element={<Goals...>} and path="/meetings" element={<Meetings...>}
        // In Sidebar line 12 it was: { label: 'Goals', icon: Target, path: '/meetings' }
        // Let's just Add the new item and leave the weird mapping alone for now unless it breaks.
        { label: 'Student Hub', icon: GraduationCap, path: '/research' },
        { label: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="glass-panel" style={{
            position: 'sticky', top: '110px',
            padding: '20px', borderRadius: '24px',
            display: 'flex', flexDirection: 'column', gap: '8px',
            minHeight: 'calc(100vh - 130px)'
        }}>
            <div style={{ marginBottom: '30px', padding: '10px' }}>
                <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</h3>
            </div>

            {menuItems.map(item => (
                <SidebarItem
                    key={item.label}
                    to={item.path}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.path}
                />
            ))}

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                        <img src={user.avatar} style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Online</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SidebarItem({ to, icon, label, active }) {
    const IconComponent = icon;
    return (
        <Link to={to} style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
            borderRadius: '16px', textDecoration: 'none',
            color: active ? 'white' : 'rgba(255,255,255,0.6)',
            background: active ? 'var(--primary)' : 'transparent',
            transition: '0.2s', fontWeight: '500'
        }}>
            <IconComponent size={20} />
            <span>{label}</span>
        </Link>
    )
}

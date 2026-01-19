import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Target, Plus, X, Trash2, Clock, Users, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function Meetings({ user, store }) {
    const [activeView, setActiveView] = useState('meetings');
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ title: '', date: '', type: 'meeting', description: '' });

    const meetings = store.meetings.filter(m => m.type === 'meeting').sort((a, b) => new Date(a.date) - new Date(b.date));
    const goalsArr = store.meetings.filter(m => m.type === 'goal').sort((a, b) => new Date(a.date) - new Date(b.date));

    // Handle adding new items
    const handleAdd = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date) return;
        store.addMeeting({ ...formData, id: 'm_' + Date.now(), author: user.name, authorId: user.id });
        setFormData({ title: '', date: '', type: 'meeting', description: '' });
        setShowAdd(false);
    };

    return (
        <div className="meetings-container" style={{ paddingBottom: '100px', minHeight: '100vh', padding: '20px' }}>

            {/* Header Section */}
            <div style={{ marginBottom: '40px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '10px',
                        background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 40px rgba(165, 180, 252, 0.3)'
                    }}
                >
                    Family Events
                </motion.h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Coordinate your family's precious moments.</p>
            </div>

            {/* Controls Bar */}
            <div style={{
                marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <TabButton
                        active={activeView === 'meetings'}
                        onClick={() => setActiveView('meetings')}
                        icon={<Calendar size={18} />}
                        label="Family Meetings"
                    />
                    <TabButton
                        active={activeView === 'goals'}
                        onClick={() => setActiveView('goals')}
                        icon={<Target size={18} />}
                        label="Yearly Goals"
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAdd(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none',
                        padding: '12px 24px', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    <Plus size={20} /> <span className="hide-mobile">Add New</span>
                </motion.button>
            </div>

            {/* Grid Content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
                <AnimatePresence mode='popLayout'>
                    {(activeView === 'meetings' ? meetings : goalsArr).map((item, i) => (
                        <MeetingCard key={item.id} item={item} user={user} store={store} index={i} />
                    ))}
                </AnimatePresence>

                {(activeView === 'meetings' ? meetings : goalsArr).length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '30px' }}
                    >
                        <Sparkles size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '10px' }}>No {activeView} yet</h3>
                        <p>Time to plan something special!</p>
                    </motion.div>
                )}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAdd && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                width: '100%', maxWidth: '500px',
                                background: 'linear-gradient(145deg, #1e1e2e, #11111b)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '32px', padding: '40px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Create Event
                                </h2>
                                <button onClick={() => setShowAdd(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="input-group">
                                    <input
                                        placeholder="Event Title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                        >
                                            <option value="meeting">🤝 Meeting</option>
                                            <option value="goal">🎯 Goal</option>
                                        </select>
                                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.5)' }}>▼</div>
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Description or Agenda..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...inputStyle, height: '120px', resize: 'none' }}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    style={{
                                        padding: '16px', borderRadius: '16px', border: 'none',
                                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                        color: 'white', fontWeight: '800', fontSize: '16px',
                                        cursor: 'pointer', marginTop: '10px',
                                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                                    }}
                                >
                                    Launch {formData.type === 'meeting' ? 'Meeting' : 'Goal'} 🚀
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sub-components & Styles
const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 25px', borderRadius: '16px',
            border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.3s ease',
            background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: active ? 'white' : 'rgba(255,255,255,0.5)',
            boxShadow: active ? '0 0 20px rgba(255,255,255,0.05)' : 'none'
        }}
    >
        {icon} {label}
    </button>
);

const MeetingCard = ({ item, user, store, index }) => {
    const isMeeting = item.type === 'meeting';
    const themeColor = isMeeting ? '#3b82f6' : '#10b981';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '25px', position: 'relative', overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
            }}
        >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: themeColor, filter: 'blur(60px)', opacity: 0.2, borderRadius: '50%' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', position: 'relative' }}>
                <span style={{
                    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px',
                    background: isMeeting ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: themeColor, padding: '6px 12px', borderRadius: '12px', border: `1px solid ${themeColor}44`
                }}>
                    {item.type}
                </span>
                {item.authorId === user.id && (
                    <button
                        onClick={() => store.deleteMeeting(item.id)}
                        style={{ background: 'rgba(255,50,50,0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }}
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>{item.title}</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                <Clock size={14} /> {format(new Date(item.date), 'MMMM dd, yyyy')}
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
                {item.description}
            </p>

            <div style={{ paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ width: '24px', height: '24px', background: 'linear-gradient(45deg, #6366f1, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                    {item.author?.[0]}
                </div>
                <span>Posted by {item.author}</span>
            </div>
        </motion.div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '15px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: '0.3s',
    fontFamily: 'inherit'
};

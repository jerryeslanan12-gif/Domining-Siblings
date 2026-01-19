import React, { useState } from 'react';
import { Camera, Edit2, MapPin, Briefcase, Heart, X, Save, Mail, Phone, Calendar, Plus, UserPlus, Baby, Shield, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Feed from './Feed';

export default function Profile({ user, store, onLogout }) {
    const [activeTab, setActiveTab] = useState('Posts');
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div style={{ background: 'transparent', minHeight: '100vh', color: 'white', paddingBottom: '40px' }}>
            {/* Cover Photo */}
            <div style={{
                height: '300px',
                background: user?.cover ? `url(${user.cover})` : 'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '0 0 32px 32px',
                position: 'relative',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        position: 'absolute', bottom: '20px', right: '20px',
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                        padding: '10px 20px', borderRadius: '20px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold',
                        transition: '0.2s'
                    }}
                >
                    <Camera size={18} /> Edit Cover
                </button>
            </div>

            {/* Profile Info Section */}
            <div className="container" style={{ maxWidth: '1000px', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={user?.avatar || 'https://via.placeholder.com/150'} style={{
                            width: '160px', height: '160px', borderRadius: '50%',
                            border: '5px solid #0f172a', objectFit: 'cover',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }} />
                        <div
                            onClick={() => setIsEditing(true)}
                            style={{
                                position: 'absolute', bottom: '10px', right: '10px',
                                background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid #0f172a', cursor: 'pointer'
                            }}
                        >
                            <Camera size={18} color="white" />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{user?.name}</h1>
                        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>{user?.bio || 'No bio yet. Tap edit to tell your story.'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => setIsEditing(true)} className="glass-btn-primary" style={{ padding: '12px 30px' }}>
                            <Edit2 size={18} /> Edit Profile
                        </button>
                        <button onClick={onLogout} className="glass-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}>
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Posts', 'About', 'Children', 'Photos'].map(t => (
                        <Tab key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
                    ))}
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 3fr', gap: '30px', alignItems: 'start' }}>

                    {/* Left Sidebar Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card-premium">
                            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Briefcase size={20} color="#3b82f6" /> Intro
                            </h3>
                            <InfoRow icon={<Briefcase size={16} />} text={user?.job || 'Add work info'} />
                            <InfoRow icon={<MapPin size={16} />} text={user?.location || 'Add location'} />
                            <InfoRow icon={<Heart size={16} />} text={user?.relationship || 'Add status'} />
                            <InfoRow icon={<Calendar size={16} />} text={`Born ${user?.birthday || '...'}`} />
                            <button className="glass-btn" style={{ width: '100%', marginTop: '15px', fontSize: '13px' }} onClick={() => setIsEditing(true)}>Edit Details</button>
                        </div>

                        <div className="card-premium" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shield size={20} /> Medical ID
                            </h3>
                            <InfoRow icon={<span style={{ fontWeight: 'bold' }}>Type</span>} text={user?.medical?.bloodType || 'N/A'} color="#fca5a5" />
                            <InfoRow icon={<span style={{ fontWeight: 'bold' }}>Allergy</span>} text={user?.medical?.allergies || 'None'} color="#fca5a5" />
                        </div>

                        {activeTab === 'Children' && (
                            <div className="card-premium">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3>Children</h3>
                                    <button onClick={() => setIsEditing(true)} className="btn-icon"><Plus size={18} /></button>
                                </div>
                                {(user?.children || []).length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No children added.</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {user.children.map((child, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                                <div style={{ background: '#3b82f6', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Baby size={20} color="white" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{child.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{child.age} years old</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div>
                        {activeTab === 'Posts' && <Feed user={user} store={store} />}

                        {activeTab === 'About' && (
                            <div className="card-premium">
                                <h3>About</h3>
                                <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginTop: '15px' }}>{user?.bio || "This user hasn't written a bio yet."}</p>
                            </div>
                        )}

                        {activeTab === 'Photos' && (
                            <div className="card-premium">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3>Photos</h3>
                                    <button
                                        className="glass-btn-primary"
                                        onClick={() => {
                                            const url = prompt("Enter photo URL:");
                                            if (url) {
                                                const updatedPhotos = [url, ...(user.photos || [])];
                                                store.updateUser({ ...user, photos: updatedPhotos });
                                            }
                                        }}
                                        style={{ fontSize: '13px', padding: '8px 16px' }}
                                    >
                                        <Plus size={16} /> Add Photo
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                                    {(user.photos || []).map((photo, i) => (
                                        <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', height: '140px' }}>
                                            <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', height: '140px', opacity: 0.5 }}>
                                            <img src={`https://picsum.photos/300?random=${i + 10}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isEditing && <EditProfileModal user={user} onClose={() => setIsEditing(false)} onSave={store.updateUser} />}
            </AnimatePresence>
        </div>
    );
}

function InfoRow({ icon, text, color = '#94a3b8' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: 'white', fontSize: '14px' }}>
            <div style={{ color: color }}>{icon}</div>
            <span style={{ color: '#cbd5e1' }}>{text}</span>
        </div>
    );
}

function Tab({ label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '15px 30px', cursor: 'pointer', fontWeight: 'bold',
                color: active ? '#3b82f6' : '#64748b',
                borderBottom: active ? '3px solid #3b82f6' : '3px solid transparent',
                transition: '0.3s'
            }}
        >
            {label}
        </div>
    );
}

function EditProfileModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        ...user,
        children: user.children || [],
        medical: user.medical || { bloodType: '', allergies: '', conditions: '', notes: '' }
    });
    const [newChild, setNewChild] = useState({ name: '', age: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div
                style={{ background: '#1e293b', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
                <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#1e293b', zIndex: 10 }}>
                    <h2 style={{ color: 'white', margin: 0 }}>Edit Profile</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <div>
                        <h4 style={{ color: '#3b82f6', marginBottom: '15px' }}>Visuals (Upload from Device)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '13px' }}>Profile Picture</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {formData.avatar && <img src={formData.avatar} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }} />}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} className="glass-input" style={{ padding: '8px', fontSize: '12px' }} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '13px' }}>Cover Photo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {formData.cover && <img src={formData.cover} alt="Preview" style={{ width: '60px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #3b82f6' }} />}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="glass-input" style={{ padding: '8px', fontSize: '12px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: '#3b82f6', marginBottom: '15px' }}>Basic Info</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className="glass-input" />
                            <input value={formData.job} onChange={e => setFormData({ ...formData, job: e.target.value })} placeholder="Job Title" className="glass-input" />
                            <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Location" className="glass-input" />
                            <input value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} type="date" className="glass-input" />
                        </div>
                        <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Short Bio" className="glass-input" style={{ width: '100%', marginTop: '15px', minHeight: '80px' }} />
                    </div>

                    <div>
                        <h4 style={{ color: '#3b82f6', marginBottom: '15px' }}>My Children</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input value={newChild.name} onChange={e => setNewChild({ ...newChild, name: e.target.value })} placeholder="Name" className="glass-input" style={{ flex: 1 }} />
                            <input value={newChild.age} onChange={e => setNewChild({ ...newChild, age: e.target.value })} placeholder="Age" className="glass-input" style={{ width: '80px' }} />
                            <button type="button" onClick={() => { if (newChild.name) { setFormData({ ...formData, children: [...formData.children, newChild] }); setNewChild({ name: '', age: '' }); } }} className="glass-btn-primary"><Plus /></button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {formData.children.map((c, i) => (
                                <div key={i} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {c.name}, {c.age}
                                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => { const ch = [...formData.children]; ch.splice(i, 1); setFormData({ ...formData, children: ch }); }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: '#ef4444', marginBottom: '15px' }}>Medical ID (Private)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <input value={formData.medical.bloodType} onChange={e => setFormData({ ...formData, medical: { ...formData.medical, bloodType: e.target.value } })} placeholder="Blood Type" className="glass-input" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }} />
                            <input value={formData.medical.allergies} onChange={e => setFormData({ ...formData, medical: { ...formData.medical, allergies: e.target.value } })} placeholder="Allergies" className="glass-input" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', sticky: 'bottom' }}>
                        <button type="button" onClick={onClose} className="glass-btn">Cancel</button>
                        <button type="submit" className="glass-btn-primary" style={{ width: '150px' }}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

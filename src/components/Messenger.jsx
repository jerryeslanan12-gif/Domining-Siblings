import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, Send, PhoneCall, Mic, MicOff, VideoOff, PhoneOff, Image as ImageIcon, Smile, MoreVertical, ArrowLeft, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Messenger({ user, store }) {
    const [activeChatId, setActiveChatId] = useState(null);
    const [input, setInput] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 10000);
        return () => clearInterval(interval);
    }, []);

    // List all users except current user
    const contacts = store.users.filter(u => u.id !== user.id);
    const activeUser = contacts.find(c => c.id === activeChatId);

    // Filter messages
    const relevantMessages = store.messages.filter(m =>
        (m.fromId === user.id && m.toId === activeChatId) ||
        (m.fromId === activeChatId && m.toId === user.id)
    ).sort((a, b) => a.timestamp - b.timestamp);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [relevantMessages]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const type = file.type.startsWith('video') ? 'video' : 'image';
                setAttachment({ type, url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if ((!input.trim() && !attachment) || !activeChatId) return;

        store.sendMessage({
            id: Date.now(),
            fromId: user.id,
            toId: activeChatId,
            text: input,
            image: attachment?.type === 'image' ? attachment.url : null,
            video: attachment?.type === 'video' ? attachment.url : null,
            timestamp: Date.now()
        });

        // Validating "viber" auto-link logic
        if (input.toLowerCase().includes('viber')) {
            setTimeout(() => {
                store.sendMessage({
                    id: Date.now() + 1,
                    fromId: activeChatId, // Simulated reply from them
                    toId: user.id,
                    text: 'Here is the Viber link you asked for:',
                    isLink: true,
                    link: 'https://www.viber.com/en/download/',
                    timestamp: Date.now()
                });
            }, 1000);
        }

        setInput('');
        setAttachment(null);
    };

    return (
        <div className="glass-card messenger-container" style={{ height: '80vh', padding: 0, overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            {/* Sidebar / Contact List */}
            <div className={`messenger-sidebar ${activeChatId ? 'mobile-hidden' : ''}`} style={{ width: '320px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '24px', color: 'white', fontWeight: 'bold', marginBottom: '15px' }}>Messages</h2>

                    {/* Online Users Row */}
                    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                        {contacts.filter(c => store.online[c.id] && (now - store.online[c.id] < 30000)).map(c => (
                            <div key={c.id} onClick={() => setActiveChatId(c.id)} style={{ cursor: 'pointer', textAlign: 'center', minWidth: '60px' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={c.avatar} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #22c55e', padding: '2px' }} />
                                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid #1e293b' }}></div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'white', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '60px' }}>
                                    {c.name.split(' ')[0]}
                                </div>
                            </div>
                        ))}
                        {contacts.filter(c => store.online[c.id] && (now - store.online[c.id] < 30000)).length === 0 && (
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>No one is online right now.</span>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {contacts.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No contacts yet.</div>
                    ) : (
                        contacts.map(c => (
                            <div key={c.id}
                                onClick={() => setActiveChatId(c.id)}
                                className={`contact-item ${activeChatId === c.id ? 'active' : ''}`}
                                style={{
                                    padding: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    background: activeChatId === c.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                    borderLeft: activeChatId === c.id ? '3px solid #3b82f6' : '3px solid transparent'
                                }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={c.avatar} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                                    {store.online[c.id] && (now - store.online[c.id] < 30000) &&
                                        <div style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid rgba(0,0,0,0.8)' }}></div>
                                    }
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0, color: 'white', fontSize: '15px' }}>{c.name}</h4>
                                        {/* Last msg time could go here */}
                                    </div>
                                    <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                                        Tap to chat
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`messenger-chat ${!activeChatId ? 'mobile-hidden' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
                {activeChatId ? (
                    <>
                        {/* Header */}
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    className="back-btn"
                                    onClick={() => setActiveChatId(null)}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px', borderRadius: '50%' }}
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <img src={activeUser?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                                <div>
                                    <h4 style={{ margin: 0, color: 'white', fontSize: '16px' }}>{activeUser?.name}</h4>
                                    {store.online[activeChatId] && (now - store.online[activeChatId] < 30000) ?
                                        <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>Active Now</span> :
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Offline</span>
                                    }
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button className="icon-btn" title="Voice Call"><Phone size={20} color="#94a3b8" /></button>
                                <button className="icon-btn active" onClick={() => setIsCalling(true)} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                                    <Video size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {relevantMessages.length === 0 && (
                                <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
                                    <p>No messages yet.</p>
                                    <p style={{ fontSize: '13px' }}>Wave to {activeUser?.name} to start!</p>
                                </div>
                            )}
                            {relevantMessages.map(m => (
                                <div key={m.id} style={{ alignSelf: m.fromId === user.id ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                    <div style={{
                                        background: m.fromId === user.id ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        padding: '10px 14px',
                                        borderRadius: m.fromId === user.id ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        fontSize: '15px',
                                        lineHeight: '1.4'
                                    }}>
                                        {m.text}
                                        {m.image && <img src={m.image} style={{ width: '100%', maxWidth: '200px', borderRadius: '8px', marginTop: '8px', display: 'block' }} />}
                                        {m.video && <video src={m.video} controls style={{ width: '100%', maxWidth: '200px', borderRadius: '8px', marginTop: '8px', display: 'block' }} />}
                                        {m.isLink && (
                                            <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
                                                <a href={m.link} target="_blank" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'underline' }}>Download Application</a>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', textAlign: m.fromId === user.id ? 'right' : 'left', padding: '0 4px' }}>
                                        {formatDistanceToNow(m.timestamp)} ago
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '10px 15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
                            {/* ... Attachment Preview Logic if needed ... */}
                            <button type="button" onClick={() => fileInputRef.current.click()} className="icon-btn-small" style={{ flexShrink: 0 }}>
                                <ImageIcon size={22} />
                            </button>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Message..."
                                    style={{
                                        width: '100%', padding: '10px 15px', paddingRight: '35px', borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.1)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white'
                                    }}
                                />
                                <Smile size={18} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            </div>
                            <button type="submit" disabled={!input.trim() && !attachment} style={{ background: (input.trim() || attachment) ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', flexShrink: 0 }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="desktop-only-placeholder" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <Send size={40} opacity={0.5} />
                        </div>
                        <h3 style={{ color: 'white', marginBottom: '10px' }}>Your Messages</h3>
                        <p>Select a contact to start chatting</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isCalling && (
                    <VideoCallModal
                        user={activeUser}
                        onEnd={() => setIsCalling(false)}
                    />
                )}
            </AnimatePresence>

            <style>{`
                .icon-btn { width: 35px; height: 35px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
                .icon-btn:hover { background: rgba(255,255,255,0.1); }
                .icon-btn-small { width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; }
                .contact-item:hover { background: rgba(255,255,255,0.05); }
                .back-btn { display: none; }

                @media (max-width: 768px) {
                    .messenger-container { height: calc(100vh - 80px) !important; border: none !important; }
                    .messenger-sidebar { width: 100% !important; }
                    .mobile-hidden { display: none !important; }
                    .back-btn { display: block; }
                    .desktop-only-placeholder { display: none !important; } /* Should not happen due to structure, but just in case */
                }
            `}</style>
        </div>
    );
}

function VideoCallModal({ user, onEnd }) {
    const [status, setStatus] = useState('calling'); // calling, connected
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('connected');
        }, 2500); // Simulate connection delay
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '600px', borderRadius: '24px', overflow: 'hidden', background: '#1e293b', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)' }}>
                {/* Main Video Area (Remote User) */}
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: status === 'connected' ? 1 : 0.3 }}
                    />

                    {status === 'calling' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={user.avatar} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid white' }} />
                                <div style={{ color: 'white', paddingRight: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{user.name}</div>
                                    <div style={{ fontSize: '14px', opacity: 0.7 }}>Calling...</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Self Video (PiP) */}
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '160px', height: '220px', background: '#334155', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        {isVideoOff ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <VideoOff size={32} />
                            </div>
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#475569' }}>
                                {/* Mock self video stream */}
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Bar */}
                <div style={{
                    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: '20px', padding: '15px 30px',
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                    borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: isMuted ? 'white' : 'rgba(255,255,255,0.2)', color: isMuted ? '#1e293b' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: isVideoOff ? 'white' : 'rgba(255,255,255,0.2)', color: isVideoOff ? '#1e293b' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                    <button
                        onClick={onEnd}
                        style={{ width: '60px', height: '60px', borderRadius: '24px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }}
                    >
                        <PhoneOff size={30} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

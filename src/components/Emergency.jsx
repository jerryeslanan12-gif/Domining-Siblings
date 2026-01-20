import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, X, HeartPulse, ShieldAlert, Flame, Syringe, ArrowRight } from 'lucide-react';
import { useStore } from '../services/store';

export default function Emergency({ active, setActive }) {
    const store = useStore();
    const [step, setStep] = useState('type-select'); // type-select, countdown, broadcasting
    const [countdown, setCountdown] = useState(5);
    const [selectedType, setSelectedType] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [currentEmergencyId, setCurrentEmergencyId] = useState(null);

    // Derived state for the active emergency
    const activeEmergency = store.emergencies.find(e => e.id === currentEmergencyId);

    useEffect(() => {
        if (!active) {
            setStep('type-select');
            setCountdown(5);
            setSelectedType(null);
        }
    }, [active]);

    useEffect(() => {
        let timer;
        if (step === 'countdown' && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (step === 'countdown' && countdown === 0) {
            startBroadcast();
        }
        return () => clearTimeout(timer);
    }, [step, countdown]);

    const selectType = (type) => {
        setSelectedType(type);
        setStep('countdown');
    };

    const startBroadcast = () => {
        setStep('broadcasting');

        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        const newEmergencyId = 'em_' + Date.now();
        setCurrentEmergencyId(newEmergencyId);

        // Initial trigger
        const handleLocation = (lat, lng) => {
            setLocation({ lat, lng });
            store.triggerEmergency({
                id: newEmergencyId,
                type: selectedType,
                lat: lat,
                lng: lng,
                createdAt: Date.now(),
                active: true,
                responders: [], // { id, name, status }
                chat: [] // { id, sender, text, time }
            });
            console.log("Emergency Broadcast Sent:", { type: selectedType, lat, lng });

            // SIMULATION: Simulate family members responding
            setTimeout(() => {
                store.respondToEmergency(newEmergencyId, {
                    id: 'sim_1', name: 'Mom', status: 'On my way', time: Date.now()
                });
            }, 5000);
            setTimeout(() => {
                store.addEmergencyChat(newEmergencyId, {
                    id: 'msg_1', sender: 'Dad', text: 'I called 911, stay put!', time: Date.now()
                });
            }, 8000);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => handleLocation(pos.coords.latitude, pos.coords.longitude),
                (err) => {
                    setLocationError("Unable to fetch GPS. Broadcasting last known location.");
                    handleLocation(0, 0); // Fallback
                },
                { enableHighAccuracy: true }
            );
        } else {
            handleLocation(0, 0);
        }
    };

    const cancelAlert = () => {
        // In a real app, require a PIN or hold-to-cancel
        setActive(false);
        setStep('type-select');
        setCountdown(5);
    };

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    className="emergency-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
                        zIndex: 9999, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: '20px',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Close Button unless broadcasting (for safety) */}
                    {step !== 'broadcasting' && (
                        <button
                            onClick={() => setActive(false)}
                            className="glass-btn secondary"
                            style={{ position: 'absolute', top: '20px', right: '20px', borderRadius: '50%', width: '50px', height: '50px', padding: 0 }}
                        >
                            <X size={24} />
                        </button>
                    )}

                    {step === 'type-select' && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            style={{ width: '100%', maxWidth: '500px' }}
                        >
                            <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '40px', fontSize: '2rem', fontWeight: '800' }}>
                                <span style={{ color: '#ff4444' }}>EMERGENCY</span> CENTER
                            </h2>
                            <div className="emergency-grid-large" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <EmergencyTypeBtn
                                    icon={<HeartPulse size={40} />}
                                    color="linear-gradient(135deg, #ef4444, #dc2626)"
                                    label="Medical"
                                    sub="Heart, Injury"
                                    onClick={() => selectType('Medical')}
                                />
                                <EmergencyTypeBtn
                                    icon={<ShieldAlert size={40} />}
                                    color="linear-gradient(135deg, #f59e0b, #d97706)"
                                    label="Safety"
                                    sub="Intruder, Danger"
                                    onClick={() => selectType('Security')}
                                />
                                <EmergencyTypeBtn
                                    icon={<Flame size={40} />}
                                    color="linear-gradient(135deg, #ea580c, #c2410c)"
                                    label="Disaster"
                                    sub="Fire, Flood"
                                    onClick={() => selectType('Disaster')}
                                />
                                <EmergencyTypeBtn
                                    icon={<Syringe size={40} />}
                                    color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                                    label="Other"
                                    sub="Critical Help"
                                    onClick={() => selectType('Other')}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 'countdown' && (
                        <div style={{ textAlign: 'center', color: 'white' }}>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                style={{
                                    width: '200px', height: '200px', borderRadius: '50%', border: '4px solid #ef4444',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px',
                                    background: 'rgba(239, 68, 68, 0.2)', boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)'
                                }}
                            >
                                <span style={{ fontSize: '100px', fontWeight: '800' }}>{countdown}</span>
                            </motion.div>
                            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Activating Emergency Beacon</h3>
                            <p style={{ opacity: 0.7, marginBottom: '40px' }}>Notifying all {store.users.length} Family Members & Services</p>
                            <button onClick={() => { setStep('type-select'); }} className="glass-btn secondary" style={{ margin: '0 auto' }}>CANCEL</button>
                        </div>
                    )}

                    {step === 'type-select' && (
                        <div style={{ marginTop: '30px', width: '100%', maxWidth: '500px' }}>
                            <button
                                onClick={() => setStep('hotlines')}
                                className="glass-btn"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6' }}
                            >
                                <Phone size={20} /> Zamboanga City Emergency Directory
                            </button>
                        </div>
                    )}

                    {step === 'hotlines' && (
                        <div style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
                                <button
                                    onClick={() => setStep('type-select')}
                                    style={{ position: 'absolute', left: 0, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                                >
                                    <ArrowRight size={24} style={{ transform: 'rotate(180deg)' }} />
                                </button>
                                <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Emergency Hotlines</h3>
                            </div>

                            <div className="glass-panel" style={{ overflowY: 'auto', padding: '20px', textAlign: 'left' }}>
                                <div style={{ marginBottom: '25px' }}>
                                    <h4 style={{ color: '#fbbf24', fontSize: '18px', uppercase: 'uppercase', letterSpacing: '1px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>City Services</h4>
                                    <HotlineItem name="CDRRMO" numbers={['0917-711-3536', '0918-9357-858', '926-9274']} />
                                    <HotlineItem name="ZCDRRMO" numbers={['990-1171', '926-1848', '955-9601']} />
                                    <HotlineItem name="EMS" numbers={['926-1849']} />
                                    <HotlineItem name="JTFZ (Joint Task Force)" numbers={['0917-710-2326', '0916-535-8106', '0928-3969-926']} />
                                </div>

                                <div>
                                    <h4 style={{ color: '#60a5fa', fontSize: '18px', uppercase: 'uppercase', letterSpacing: '1px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>Police Stations</h4>
                                    <HotlineItem name="ZCPO (Police Office)" numbers={['0977-855-8138']} />
                                    <HotlineItem name="PS1 - Vitali" numbers={['0935-604-4139', '0998-967-3923']} />
                                    <HotlineItem name="PS2 - Curuan" numbers={['0935-457-2483', '0918-230-7135']} />
                                    <HotlineItem name="PS3 - Sangali" numbers={['0917-146-2240', '0935-303-7144', '955-0156']} />
                                    <HotlineItem name="PS4 - Culianan" numbers={['0975-333-8826', '0935-382-7161', '955-0255']} />
                                    <HotlineItem name="PS5 - Divisoria" numbers={['0917-677-8907', '0998-967-3927', '955-6887']} />
                                    <HotlineItem name="PS6 - Tetuan" numbers={['0997-746-5666', '0926-174-0151', '991-0678']} />
                                    <HotlineItem name="PS7 - Sta. Maria" numbers={['0917-307-8098', '0998-967-3929', '985-9001']} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'broadcasting' && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                style={{
                                    position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%',
                                    width: '100vw', height: '100vw', background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, transparent 70%)',
                                    zIndex: -1
                                }}
                            />

                            <div className="glass-panel" style={{ padding: '40px', border: '2px solid #ef4444', boxShadow: '0 0 100px rgba(239,68,68,0.5)', width: '90%', maxWidth: '600px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                    <AlertTriangle size={80} color="#ef4444" />
                                    <div>
                                        <h2 style={{ color: 'white', fontSize: '48px', fontWeight: '900', lineHeight: '1', margin: 0 }}>SOS ACTIVE</h2>
                                        <p style={{ color: '#fda4af', fontSize: '20px', marginTop: '10px' }}>Broadcasting to {store.users.length} Family Members</p>
                                    </div>
                                </div>

                                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', fontSize: '18px', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', fontWeight: 'bold' }}>
                                    <MapPin size={18} style={{ marginRight: '10px' }} />
                                    Loc: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Acquiring...'}
                                </p>

                                {/* Response Hub UI */}
                                <div style={{ textAlign: 'left', marginBottom: '30px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                                    <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Emergency Response Hub</h4>

                                    {/* Responders List */}
                                    <div style={{ marginBottom: '20px' }}>
                                        {activeEmergency?.responders?.length > 0 ? (
                                            activeEmergency.responders.map((r, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', background: 'rgba(74, 222, 128, 0.1)', padding: '15px', borderRadius: '12px', borderLeft: '5px solid #4ade80' }}>
                                                    <div style={{ width: '12px', height: '12px', background: '#4ade80', borderRadius: '50%' }}></div>
                                                    <div>
                                                        <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{r.name}</div>
                                                        <div style={{ color: '#4ade80', fontSize: '14px' }}>{r.status}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Waiting for family response...</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                    <button
                                        onClick={cancelAlert}
                                        className="glass-btn secondary"
                                        style={{ width: '100%', background: '#334155', border: '1px solid #475569', fontSize: '20px', padding: '20px', fontWeight: 'bold' }}
                                    >
                                        I AM SAFE
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            )}
        </AnimatePresence>
    );
}

function EmergencyTypeBtn({ icon, color, label, sub, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                background: 'rgba(30, 41, 59, 0.6)', padding: '24px', borderRadius: '24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                width: '100%', border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer', backdropFilter: 'blur(10px)',
                color: 'white'
            }}
        >
            <div style={{ background: color, width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                {icon}
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{label}</div>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>{sub}</div>
            </div>
        </motion.button>
    )
}

function HotlineItem({ name, numbers }) {
    return (
        <div style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px', fontSize: '15px' }}>{name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {numbers.map((num, i) => (
                    <a
                        key={i}
                        href={`tel:${num.replace(/-/g, '')}`}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa',
                            padding: '6px 12px', borderRadius: '20px',
                            textDecoration: 'none', fontSize: '13px', fontWeight: '500',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        <Phone size={12} fill="currentColor" /> {num}
                    </a>
                ))}
            </div>
        </div>
    )
}

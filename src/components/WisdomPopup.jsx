import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { wisdomQuotes } from '../data/quotes';

export default function WisdomPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const triggerPopup = () => {
            const randomQuote = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];
            setQuote(randomQuote);
            setIsVisible(true);
        };

        // Show popup initially after a short delay
        const initialTimer = setTimeout(() => {
            triggerPopup();
        }, 2000);

        // Then maximize randomness - every 2-5 minutes? 
        // Or just once per session for now as requested "add a pop up".
        // Let's make it trigger every 60 seconds for demo purposes
        const loopTimer = setInterval(() => {
            // We need to access the CURRENT isVisible. 
            // Since this effect closes over the initial isVisible (false), 
            // checking !isVisible here might be stale if it changed?
            // Actually, we should use the functional update or a ref if we want current value without re-running effect.
            // But for simplicity, let's just trigger it. The user can close it.
            // Or better: use a ref for isVisible.
            triggerPopup();
        }, 60000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(loopTimer);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            // "pop up for 20 seconds"
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, 20000);
            return () => clearTimeout(hideTimer);
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 4 } }} // "fade for 4 seconds"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '30px',
                        maxWidth: '350px',
                        width: '100%',
                        zIndex: 9999,
                        pointerEvents: 'none' // Allow clicking through if needed, but we have interactive elements inside
                    }}
                >
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        pointerEvents: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700' }}>
                                <Sparkles size={18} />
                                <span style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Wisdom</span>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <p style={{
                            fontSize: '16px',
                            lineHeight: '1.5',
                            margin: 0,
                            fontFamily: 'Georgia, serif',
                            fontStyle: 'italic'
                        }}>
                            "{quote}"
                        </p>

                        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 20, ease: "linear" }}
                                style={{ height: '100%', background: '#ffd700' }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

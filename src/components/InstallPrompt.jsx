import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isStandalone, setIsStandalone] = useState(() =>
        (typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true))
    );

    useEffect(() => {


        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Only show if not already standalone
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                setShowInstall(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstall(false);
        }
        setDeferredPrompt(null);
    };

    // If already standalone, we might want a "Share Link" button instead?
    // User asked: "notifies the user to download the app"

    if (isStandalone) return null;

    return (
        <AnimatePresence>
            {showInstall && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        right: '20px',
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        pointerEvents: 'none' // wrapper
                    }}
                >
                    <div style={{
                        background: '#1877F2',
                        color: 'white',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        pointerEvents: 'auto',
                        maxWidth: '500px',
                        width: '100%'
                    }}>
                        <div style={{ background: 'white', padding: '8px', borderRadius: '8px', color: '#1877F2' }}>
                            <Download size={24} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '16px' }}>Install Domining Siblings</h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
                                Add to Home Screen for the best experience.
                            </p>
                        </div>

                        <button
                            onClick={handleInstallClick}
                            style={{
                                background: 'white',
                                color: '#1877F2',
                                fontWeight: 'bold',
                                padding: '8px 16px',
                                borderRadius: '6px'
                            }}
                        >
                            Install
                        </button>

                        <button
                            onClick={() => setShowInstall(false)}
                            style={{ background: 'transparent', color: 'white', opacity: 0.7 }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

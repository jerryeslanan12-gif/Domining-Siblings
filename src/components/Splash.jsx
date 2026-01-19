import React from 'react';
import { motion } from 'framer-motion';

export default function Splash() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ position: 'relative' }}
            >
                <div style={{
                    width: '180px', height: '180px', borderRadius: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    padding: '20px',
                    overflow: 'hidden'
                }}>
                    <img src="/app-icon.png" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }} />
                </div>

                {/* Glow behind */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
                    zIndex: -1, filter: 'blur(20px)'
                }}></div>
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginTop: '40px', fontSize: '24px', fontWeight: 'bold', color: 'white', letterSpacing: '2px' }}
            >
                DOMINING
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.6 }}
                style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px' }}
            >
                Family Always First
            </motion.p>
        </motion.div>
    );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Mail, Lock, User, Phone, CheckCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function Login({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationStep, setVerificationStep] = useState('form'); // 'form', 'verify'
    const [verificationCode, setVerificationCode] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    });

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate sending SMS
        setTimeout(() => {
            setLoading(false);
            setVerificationStep('verify');
        }, 1500);
    };

    const handleVerifyAndLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Mock Verification Check
        if (verificationCode !== '1111') { // Mock code
            // In real app, check against backend
        }

        setTimeout(() => {
            // Mock Encryption of sensitive data before "storing"
            const encryptedUser = {
                id: Date.now().toString(),
                name: formData.name || (formData.email === 'fb@example.com' ? 'Facebook User' : 'User'),
                email: formData.email,
                contact: formData.phone, // "Encrypted" conceptually in backend
                isVerified: true,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                cover: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
                children: []
            };
            onLogin(encryptedUser);
            setLoading(false);
        }, 1500);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            // Mock Login
            const user = {
                id: '1',
                name: 'Demo User',
                email: formData.email,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                cover: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
                children: []
            };
            onLogin(user);
            setLoading(false);
        }, 1000);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="premium-login-page">
            <div className="bg-bubbles">
                {[...Array(3)].map((_, i) => <div key={i} className="bubble"></div>)}
            </div>

            <div className="login-content">
                <div className="brand-section">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="logo-icon-large"
                    >
                        DS
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Domining Siblings
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        The most private & beautiful space for your family to grow, connect, and thrive together.
                    </motion.p>

                    <div className="brand-features">
                        <div className="feature"><ShieldCheck size={18} /> Private Server</div>
                        <div className="feature"><Heart size={18} /> Family Centered</div>
                        <div className="feature"><CheckCircle size={18} /> End-to-End Secure</div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="login-card-premium"
                >
                    <AnimatePresence mode='wait'>
                        {verificationStep === 'verify' ? (
                            <motion.form
                                key="verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyAndLogin}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <ShieldCheck size={48} color="#4ade80" />
                                    <h2>Verification</h2>
                                    <p style={{ color: '#94a3b8' }}>Enter the code sent to {formData.phone}</p>
                                </div>

                                <div className="input-field">
                                    <Lock size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter Code (use 1111)"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        required
                                        style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '20px' }}
                                    />
                                </div>
                                <button type="submit" className="login-btn-p" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Complete Registration'} <ArrowRight size={18} />
                                </button>
                                <button type="button" onClick={() => setVerificationStep('form')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '100%' }}>
                                    Back
                                </button>
                            </motion.form>
                        ) : isSignUp ? (
                            <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendCode}>
                                <h2>Create Account</h2>
                                <div className="input-field">
                                    <User size={18} />
                                    <input name="name" placeholder="Full Name" onChange={handleChange} required />
                                </div>
                                <div className="input-field">
                                    <Mail size={18} />
                                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
                                </div>
                                <div className="input-field">
                                    <Phone size={18} />
                                    <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
                                </div>
                                <div className="input-field">
                                    <Lock size={18} />
                                    <input name="password" type="password" placeholder="Create Password" onChange={handleChange} required />
                                </div>
                                <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', padding: '0 10px' }}>
                                    <input
                                        type="checkbox"
                                        required
                                        style={{ width: '20px', height: '20px', margin: 0, boxShadow: 'none' }}
                                    />
                                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textAlign: 'left' }}>
                                        I agree to the <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Terms</span> & <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Privacy Policy</span> and consent to data collection.
                                    </label>
                                </div>
                                <button type="submit" className="login-btn-p" disabled={loading}>
                                    {loading ? 'Sending Code...' : 'Verify Phone & Join'} <ArrowRight size={18} />
                                </button>
                                <div className="switch-auth">
                                    Already have an account?
                                    <button type="button" onClick={() => setIsSignUp(false)}>Sign In</button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleLogin}>
                                <h2>Welcome Back</h2>
                                <div className="input-field">
                                    <Mail size={18} />
                                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
                                </div>
                                <div className="input-field">
                                    <Lock size={18} />
                                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                                </div>
                                <button type="submit" className="login-btn-p" disabled={loading}>
                                    {loading ? 'Accessing Secure Vault...' : 'Secure Login'} <ArrowRight size={18} />
                                </button>

                                <div style={{ margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>

                                <button type="button" className="login-btn-p" style={{ background: '#1877F2' }} onClick={(e) => { e.preventDefault(); onLogin({ name: 'Facebook User', email: 'fb@user.com' }) }}>
                                    <Facebook size={18} /> Continue with Facebook
                                </button>

                                <div className="switch-auth">
                                    New to the family?
                                    <button type="button" onClick={() => setIsSignUp(true)}>Create Account</button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`
        .premium-login-page { 
            min-height: 100vh; 
            background: #0f172a; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 20px; 
            overflow: hidden;
            position: relative;
            font-family: 'Inter', sans-serif;
        }
        .bg-bubbles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
        .bubble { position: absolute; background: rgba(255,255,255,0.03); border-radius: 50%; bottom: -160px; animation: bubbleUp 25s infinite ease-in; }
        .bubble:nth-child(1) { width: 80px; height: 80px; left: 10%; animation-duration: 22s; }
        .bubble:nth-child(2) { width: 150px; height: 150px; left: 20%; animation-delay: 2s; }
        .bubble:nth-child(3) { width: 50px; height: 50px; left: 35%; animation-duration: 18s; }
        .bubble:nth-child(4) { width: 200px; height: 200px; left: 50%; animation-delay: 5s; }
        .bubble:nth-child(5) { width: 100px; height: 100px; left: 65%; animation-duration: 25s; }
        .bubble:nth-child(6) { width: 40px; height: 40px; left: 80%; animation-delay: 8s; }
        @keyframes bubbleUp { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-1200px) rotate(360deg); opacity: 0; } }
        
        .login-content { display: flex; gap: 80px; align-items: center; z-index: 2; max-width: 1200px; width: 100%; }
        .brand-section { flex: 1; color: white; }
        .logo-icon-large { width: 80px; height: 80px; background: linear-gradient(45deg, #3b82f6, #06b6d4); border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 800; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4); }
        .brand-section h1 { font-size: 56px; font-weight: 800; margin-bottom: 16px; letter-spacing: -1px; }
        .brand-section p { font-size: 18px; opacity: 0.7; line-height: 1.6; margin-bottom: 32px; }
        .brand-features { display: flex; flex-wrap: wrap; gap: 20px; }
        .feature { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; opacity: 0.9; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); }
        
        .login-card-premium { width: 450px; background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 32px; padding: 48px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .login-card-premium h2 { color: white; font-size: 32px; margin-bottom: 32px; font-weight: 700; }
        .input-field { position: relative; margin-bottom: 20px; }
        .input-field svg { position: absolute; left: 16px; top: 16px; color: rgba(255,255,255,0.4); }
        .input-field input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 16px 16px 48px; color: white; outline: none; transition: 0.3s; font-size: 16px; }
        .input-field input:focus { border-color: #3b82f6; background: rgba(255,255,255,0.08); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .login-btn-p { width: 100%; background: #3b82f6; color: white; padding: 16px; border-radius: 16px; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; margin-top: 10px; }
        .login-btn-p:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3); }
        .fb-login-btn { width: 100%; background: #1877F2; color: white; padding: 14px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 600; }
        .divider { margin: 24px 0; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); line-height: 0.1em; }
        .divider span { background: #0f172a; padding: 0 15px; color: rgba(255,255,255,0.4); font-size: 12px; font-weight: 700; letter-spacing: 1px; }
        .switch-text { margin-top: 32px; text-align: center; color: rgba(255,255,255,0.6); font-size: 14px; }
        .switch-text span { color: #3b82f6; font-weight: 700; cursor: pointer; }
        
        @media (max-width: 1000px) {
            .login-content { flex-direction: column; text-align: center; gap: 40px; }
            .brand-section h1 { font-size: 40px; }
            .brand-features { justify-content: center; }
            .login-card-premium { width: 100%; max-width: 450px; padding: 32px; }
        }
      `}</style>
        </div>
    );
}

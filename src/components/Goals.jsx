import React, { useState } from 'react';
import { Target, Plus, TrendingUp, Calendar, DollarSign, CheckCircle, Users, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function Goals({ store, user }) {
    const [isAdding, setIsAdding] = useState(false);

    // Sort goals: Active first, then by deadline
    const goals = (store.goals || []).sort((a, b) => {
        if (a.completed === b.completed) return new Date(a.deadline) - new Date(b.deadline);
        return a.completed ? 1 : -1;
    });

    const totalTarget = goals.reduce((acc, g) => acc + parseFloat(g.target || 0), 0);
    const totalProgress = goals.reduce((acc, g) => acc + parseFloat(g.progress || 0), 0);
    const overallPercent = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;

    return (
        <div className="goals-container" style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh', background: 'transparent' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'linear-gradient(90deg, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px', textShadow: '0 10px 30px rgba(255, 0, 204, 0.3)' }}
                >
                    Family Ambitions
                </motion.div>
                <p style={{ color: '#a5b4fc', fontSize: '1.2rem', marginTop: '10px' }}>Dream big, achieve together.</p>

                {/* Overall Progress Circle */}
                <div style={{ margin: '30px auto', width: '120px', height: '120px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
                        <motion.circle
                            cx="60" cy="60" r="50"
                            stroke="url(#gradient)"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray="314"
                            strokeDashoffset={314 - (314 * overallPercent / 100)}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 314 }}
                            animate={{ strokeDashoffset: 314 - (314 * overallPercent / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{ position: 'absolute', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{overallPercent}%</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAdding(true)}
                    style={{
                        background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
                        padding: '15px 35px',
                        borderRadius: '30px',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: '0 10px 25px rgba(244, 63, 94, 0.5)',
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '10px'
                    }}
                >
                    <Plus size={24} /> Launch New Goal
                </motion.button>
            </div>

            {/* Goals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {goals.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#64748b', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.1)' }}>
                        <Sparkles size={48} style={{ marginBottom: '15px', color: '#fbcfe8' }} />
                        <h3>No Active Goals</h3>
                        <p>Ignite the family spirit by setting your first goal!</p>
                    </div>
                ) : (
                    goals.map((goal, idx) => (
                        <GoalCard key={goal.id} goal={goal} store={store} user={user} index={idx} />
                    ))
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <AddGoalModal
                        onClose={() => setIsAdding(false)}
                        onAdd={(goal) => {
                            store.addGoal({ ...goal, id: Date.now(), createdBy: user.id, progress: 0, completed: false, contributions: [] });
                            setIsAdding(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function GoalCard({ goal, store, user, index }) {
    const isCompleted = goal.progress >= goal.target;
    const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));

    const colors = [
        ['#3b82f6', '#2dd4bf'], // Blue/Teal
        ['#8b5cf6', '#d946ef'], // Purple/Pink
        ['#f59e0b', '#ef4444'], // Orange/Red
        ['#10b981', '#3b82f6'], // Green/Blue
        ['#ec4899', '#f43f5e']  // Pink/Red
    ];
    // Use ID for stable colors across sorts
    const themeIndex = typeof goal.id === 'string' ? goal.id.charCodeAt(goal.id.length - 1) : goal.id;
    const theme = colors[themeIndex % colors.length];

    const handleContribute = () => {
        const amount = prompt("Enter amount/progress to add:");
        if (amount && !isNaN(amount)) {
            const newProgress = parseFloat(goal.progress) + parseFloat(amount);
            const isNowCompleted = newProgress >= goal.target;
            store.updateGoal({
                ...goal,
                progress: newProgress,
                completed: isNowCompleted,
                contributions: [...(goal.contributions || []), { userId: user.id, amount: parseFloat(amount), date: Date.now() }]
            });
            if (isNowCompleted) alert("CONGRATULATIONS! Goal Achieved! 🏆");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
                background: `linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isCompleted ? `0 20px 50px -12px ${theme[1]}55` : '0 10px 30px -10px rgba(0,0,0,0.5)'
            }}
        >
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: theme[0], filter: 'blur(80px)', opacity: 0.4, borderRadius: '50%' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
                <div>
                    <span style={{
                        fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px',
                        background: `linear-gradient(45deg, ${theme[0]}, ${theme[1]})`,
                        padding: '6px 12px', borderRadius: '20px', color: 'white'
                    }}>
                        {goal.category}
                    </span>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '15px 0 5px', color: 'white' }}>{goal.title}</h3>
                </div>
                {isCompleted ? (
                    <div style={{ background: '#22c55e', borderRadius: '50%', padding: '10px', boxShadow: '0 5px 15px rgba(34,197,94,0.4)' }}>
                        <Trophy size={24} color="white" />
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '10px' }}>
                        <Target size={24} color={theme[1]} />
                    </div>
                )}
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '30px', lineHeight: '1.6' }}>{goal.description}</p>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                    <span style={{ color: theme[1] }}>{percent}%</span>
                    <span style={{ color: 'white' }}>{goal.progress} / {goal.target} {goal.unit}</span>
                </div>
                <div style={{ height: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden', padding: '2px' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: '8px', background: `linear-gradient(90deg, ${theme[0]}, ${theme[1]})`, boxShadow: `0 0 15px ${theme[0]}` }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', color: '#94a3b8', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> {goal.deadline ? format(new Date(goal.deadline), 'MMM d, yyyy') : 'No Date'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={14} /> {goal.contributions?.length || 0} contribs</div>
            </div>

            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
                {!isCompleted && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContribute}
                        style={{
                            background: 'white', color: '#0f172a', border: 'none',
                            padding: '12px 25px', borderRadius: '15px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}
                    >
                        <TrendingUp size={18} /> Boost Goal
                    </motion.button>
                )}
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{ color: '#22c55e', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <Sparkles size={20} /> COMPLETED
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function AddGoalModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({ title: '', description: '', target: '', unit: '', deadline: '', category: 'Financial' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000 }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'linear-gradient(145deg, #1e1e2e, #161625)',
                    padding: '40px', borderRadius: '40px', width: '90%', maxWidth: '550px',
                    border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
            >
                <h2 style={{ color: 'white', marginBottom: '30px', fontSize: '28px', fontWeight: '800' }}>🚀 Launch New Goal</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        placeholder="Goal Title (e.g., Summer Trip)"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        style={{ padding: '16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', outline: 'none' }}
                    />
                    <textarea
                        placeholder="Why is this important?"
                        required
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        style={{ padding: '16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', fontFamily: 'inherit', outline: 'none', resize: 'none' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input
                            placeholder="Target"
                            type="number"
                            required
                            value={formData.target}
                            onChange={e => setFormData({ ...formData, target: e.target.value })}
                            style={{ padding: '16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                        />
                        <input
                            placeholder="Unit (e.g. PHP)"
                            value={formData.unit}
                            onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            style={{ padding: '16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            style={{ padding: '16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                        >
                            <option value="Financial">💰 Financial</option>
                            <option value="Health">💪 Health</option>
                            <option value="Travel">✈️ Travel</option>
                            <option value="Education">🎓 Education</option>
                            <option value="Project">🔨 Project</option>
                        </select>
                        <input
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            style={{ padding: '16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '15px 30px', borderRadius: '15px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                        <button type="submit" style={{ padding: '15px 40px', borderRadius: '15px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' }}>GO!</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

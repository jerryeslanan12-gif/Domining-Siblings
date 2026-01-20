import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Link2, Info, X, Baby, Heart, Shield, Share2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function FamilyTree({ store }) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeItems, setTreeItems] = useState(store.users.map(u => u.id));
    const [connectMode, setConnectMode] = useState(false);
    const [connectionSource, setConnectionSource] = useState(null);

    // Sync if users change
    useEffect(() => {
        setTreeItems(store.users.map(u => u.id));
    }, [store.users]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTreeItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleNodeClick = (userId) => {
        if (connectMode) {
            if (!connectionSource) {
                setConnectionSource(userId);
            } else {
                if (connectionSource === userId) {
                    setConnectionSource(null); // Deselect
                } else {
                    store.connectMembers(connectionSource, userId);
                    setConnectionSource(null);
                    setConnectMode(false); // Validated and linked
                }
            }
        } else {
            const user = store.users.find(u => u.id === userId);
            setSelectedNode(user);
        }
    };

    return (
        <div className="family-tree-canvas" style={{ minHeight: '85vh', borderRadius: '32px', position: 'relative', overflow: 'auto', padding: '40px', border: '1px solid #eef2f6' }}>
            <div className="tree-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="icon-circle" style={{ background: 'var(--primary-color)', color: 'white' }}><Users size={24} /></div>
                        <div>
                            <h2 style={{ margin: 0 }}>Domining Lineage</h2>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Interactive Visual Map • Drag to Reorder</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className={`glass-btn ${connectMode ? 'active-mode' : ''}`}
                            onClick={() => { setConnectMode(!connectMode); setConnectionSource(null); }}
                            style={{
                                padding: '10px 20px', fontSize: '14px',
                                background: connectMode ? '#3b82f6' : 'white',
                                color: connectMode ? 'white' : '#1e293b',
                                border: connectMode ? 'none' : '1px solid #e2e8f0'
                            }}
                        >
                            <Link2 size={16} /> {connectMode ? (connectionSource ? 'Select Child...' : 'Select Parent...') : 'Link Members'}
                        </button>
                    </div>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={treeItems}
                    strategy={rectSortingStrategy}
                >
                    <div className="nodes-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '30px', marginTop: '40px' }}>
                        {treeItems.map(id => {
                            const user = store.users.find(u => u.id === id);
                            if (!user) return null;
                            const isOnline = store.online[id] && (Date.now() - store.online[id] < 30000);
                            return (
                                <SortableFamilyNode
                                    key={id}
                                    id={id}
                                    user={user}
                                    isOnline={isOnline}
                                    onClick={() => handleNodeClick(id)}
                                    isActive={selectedNode?.id === id || connectionSource === id}
                                    isConnecting={connectMode}
                                />
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Simulated connection line instructions or visuals could go here */}

            <AnimatePresence>
                {selectedNode && (
                    <NodeDetail
                        user={selectedNode}
                        allUsers={store.users}
                        onClose={() => setSelectedNode(null)}
                    />
                )}
            </AnimatePresence>

            <style>{`
        .family-tree-canvas { 
            box-shadow: inset 0 0 50px rgba(0,0,0,0.1); 
            background-image: url('/family_tree_bg.png');
            background-size: cover;
            background-position: center bottom;
            background-repeat: no-repeat;
        }
        .icon-circle { width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); backdrop-filter: blur(5px); background: rgba(255,255,255,0.2) !important; color: white !important; border: 1px solid rgba(255,255,255,0.3); }
        
        .tree-header h2 { color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .tree-header p { color: rgba(255,255,255,0.9) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

        .node-card { 
            background: rgba(255, 255, 255, 0.85); 
            padding: 15px; 
            border-radius: 50px; /* More organic/fruit shape */
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            gap: 8px; 
            cursor: Grab; 
            border: 2px solid rgba(255,255,255,0.5); 
            transition: 0.3s; 
            position: relative; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1); 
            backdrop-filter: blur(8px);
            width: 140px;
        }
        .node-card:active { cursor: Grabbing; }
        .node-card:hover { 
            transform: translateY(-8px) scale(1.05); 
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
            border-color: #fff;
        }
        .node-card.active { border-color: #22c55e; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3); transform: scale(1.1); }
        
        .node-avatar { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        
        .node-name { font-weight: 800; font-size: 14px; text-align: center; color: #14532d; line-height: 1.2; margin-top: 5px; text-shadow: 0 1px 0 rgba(255,255,255,0.5); }
        .node-role { font-size: 10px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px; background: #dcfce7; padding: 3px 10px; border-radius: 20px; border: 1px solid #bbf7d0; }
      
        .detail-card-premium button { cursor: pointer; border: none; transition: 0.2s; }
        .detail-card-premium button:hover { transform: scale(1.1); }

        /* Floating Animation */
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .nodes-container > div { animation: float 6s ease-in-out infinite; }
        .nodes-container > div:nth-child(even) { animation-delay: 1s; }
        .nodes-container > div:nth-child(3n) { animation-delay: 2s; }
      `}</style>
        </div>
    );
}

function SortableFamilyNode({ id, user, isOnline, onClick, isActive, isConnecting }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div
                className={`node-card ${isActive ? 'active' : ''} ${isConnecting ? 'connecting' : ''}`}
                onClick={(e) => {
                    onClick();
                }}
            >
                {/* Active/Online Indicator */}
                {isOnline && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: '#22c55e', border: '2px solid white',
                        boxShadow: '0 0 10px #22c55e', zIndex: 10
                    }} title="Online Now"></div>
                )}

                {isActive && isConnecting && (
                    <div style={{ position: 'absolute', top: -10, right: -10, background: '#3b82f6', color: 'white', borderRadius: '50%', padding: '5px' }}>
                        <Link2 size={16} />
                    </div>
                )}
                <img src={user.avatar} className="node-avatar" alt={user.name} />
                <div className="node-name">{user.name}</div>
                <div className="node-role">{user.familyRole || 'Member'}</div>
            </div>
        </div>
    );
}

function NodeDetail({ user, allUsers, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="detail-overlay"
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', zIndex: 7000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
            <motion.div
                initial={{ y: 50, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                className="detail-card-premium"
                style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
            >
                <div style={{ height: '120px', background: 'linear-gradient(45deg, #3b82f6, #06b6d4)', position: 'relative' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', padding: '5px' }}><X size={20} /></button>
                </div>

                <div style={{ padding: '0 30px 40px 30px', marginTop: '-50px', textAlign: 'center' }}>
                    <img src={user.avatar} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '5px solid white', objectFit: 'cover', margin: '0 auto' }} />
                    <h2 style={{ marginTop: '15px', marginBottom: '5px' }}>{user.name}</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>{user.job || 'Family Member'} • {user.location || 'Unknown'}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '20px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#3b82f6', marginBottom: '5px' }}>AGE</div>
                            <div style={{ fontWeight: '700' }}>{user.birthday ? (new Date().getFullYear() - new Date(user.birthday).getFullYear()) : '??'} Years</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '20px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', marginBottom: '5px' }}>CHILDREN</div>
                            <div style={{ fontWeight: '700' }}>{user.children?.length || 0} Total</div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><Baby size={18} /> Direct Descendants</h4>
                        {(!user.children || user.children.length === 0) ? (
                            <p style={{ fontSize: '14px', color: '#94a3b8' }}>No recorded descendants in the lineage.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {user.children.map((child, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#f8fafc', borderRadius: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white' }}><Baby size={20} /></div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{child.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>Child • {child.age} years old</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

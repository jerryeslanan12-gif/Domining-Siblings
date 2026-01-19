import React, { useState } from 'react';
import { Image, Video, Smile, MoreHorizontal, ThumbsUp, MessageSquare, Share2, Send, MapPin, X, Gift } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed({ user, store, searchQuery }) {
    const [newPost, setNewPost] = useState('');
    const [attachment, setAttachment] = useState(null); // { type: 'image' | 'video', url: string }
    const [feeling, setFeeling] = useState('');
    const [location, setLocation] = useState('');

    const [showFeelings, setShowFeelings] = useState(false);

    const FEELINGS_LIST = ['Happy 😄', 'Excited 🤩', 'Blessed 😇', 'Loved 🥰', 'Sad 😔', 'Tired 😴', 'Angry 😠', 'Sick 😷'];

    const handlePost = () => {
        if (!newPost.trim() && !attachment) return;
        const post = {
            id: Date.now(),
            author: user?.name || 'Unknown',
            authorId: user?.id,
            avatar: user?.avatar || 'https://via.placeholder.com/40',
            content: newPost,
            image: attachment?.type === 'image' ? attachment.url : null,
            video: attachment?.type === 'video' ? attachment.url : null,
            feeling: feeling,
            location: location,
            likes: [], // Will store objects now { userId, type }
            comments: [],
            timestamp: Date.now()
        };
        store.addPost(post);
        setNewPost('');
        setAttachment(null);
        setFeeling('');
        setLocation('');
    };

    const fileInputRef = React.useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Size check: 10MB limit for base64 safety in localStorage
            if (file.size > 10 * 1024 * 1024) {
                alert("File is too large! Please upload files under 10MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const type = file.type.startsWith('video') ? 'video' : 'image';
                setAttachment({ type, url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = (type) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === 'video' ? 'video/*' : 'image/*';
            fileInputRef.current.click();
        }
    };

    const addLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // Start with coords, could call an API here if allowed
                    setLocation(`Lat: ${pos.coords.latitude.toFixed(2)}, Long: ${pos.coords.longitude.toFixed(2)}`);
                },
                () => {
                    const loc = prompt("Location access denied or failed. Enter manually:");
                    if (loc) setLocation(loc);
                }
            );
        } else {
            const loc = prompt("Where are you?");
            if (loc) setLocation(loc);
        }
    };

    const filteredPosts = store.posts.filter(p => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            p.content?.toLowerCase().includes(query) ||
            p.author?.toLowerCase().includes(query) ||
            p.feeling?.toLowerCase().includes(query) ||
            p.location?.toLowerCase().includes(query)
        );
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => b.timestamp - a.timestamp);

    const shareToSocial = (post) => {
        const text = encodeURIComponent(`"${post.content}" - Shared from Domining Family Hub`);
        const url = encodeURIComponent(window.location.href);
        // Facebook share link
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    };

    const postAJoke = async () => {
        try {
            const res = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
            const data = await res.json();
            const jokeText = data.type === 'single' ? data.joke : `${data.setup} ... ${data.delivery}`;

            const post = {
                id: Date.now(),
                author: user?.name || 'System',
                authorId: user?.id,
                avatar: user?.avatar || 'https://via.placeholder.com/40',
                content: jokeText,
                feeling: 'Excited 🤩',
                location: 'The Comedy Club',
                likes: [],
                comments: [],
                timestamp: Date.now(),
                type: 'joke'
            };
            store.addPost(post);
        } catch (e) {
            alert("Couldn't fetch a joke right now. Try telling one yourself!");
        }
    };

    // Helper to get formatted like count/types
    const getReactionSummary = (likes = []) => {
        // Normalize
        const safeLikes = likes.map(l => typeof l === 'string' ? { userId: l, type: 'like' } : l);
        if (safeLikes.length === 0) return '0 Likes';

        // Count types
        const counts = safeLikes.reduce((acc, l) => {
            acc[l.type] = (acc[l.type] || 0) + 1;
            return acc;
        }, {});

        // If only likes, return count
        if (Object.keys(counts).length === 1 && counts['like']) return `${safeLikes.length} Likes`;

        // Show top 3 icons
        const icons = { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😡' };
        const types = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {types.slice(0, 3).map(t => <span key={t}>{icons[t]}</span>)}
                <span>{safeLikes.length}</span>
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
            {/* Birthday Section */}
            <BirthdayHero store={store} currentUser={user} />

            {/* Create Post */}
            <div className="glass-card">
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <img src={user?.avatar || 'https://via.placeholder.com/40'} style={{ width: '48px', height: '48px', borderRadius: '16px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                        <input
                            className="glass-input"
                            value={newPost}
                            onChange={e => setNewPost(e.target.value)}
                            placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'User'}?`}
                            onKeyDown={e => e.key === 'Enter' && handlePost()}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />

                        {/* Staged Metadata Display */}
                        {(attachment || feeling || location) && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                {attachment && (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        {attachment.type === 'image' ? (
                                            <img src={attachment.url} style={{ height: '60px', borderRadius: '8px' }} />
                                        ) : (
                                            <div style={{ height: '60px', width: '100px', background: '#000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>🎥 Video</div>
                                        )}
                                        <button onClick={() => setAttachment(null)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                                    </div>
                                )}
                                {feeling && (
                                    <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                                        <Smile size={14} /> is feeling {feeling}
                                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFeeling('')} />
                                    </span>
                                )}
                                {location && (
                                    <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                        <MapPin size={14} flexShrink={0} />
                                        {location.includes("Lat") ? "Current Location" : location}
                                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => setLocation('')} flexShrink={0} />
                                    </span>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handlePost}
                                style={{
                                    background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer',
                                    padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'
                                }}
                            >
                                <Send size={16} /> Post
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <ActionButton icon={<Image size={20} color="#4ade80" />} label="Photo" onClick={() => triggerFileUpload('image')} />
                        <ActionButton icon={<Video size={20} color="#f472b6" />} label="Video" onClick={() => triggerFileUpload('video')} />
                        <div style={{ position: 'relative' }}>
                            <ActionButton icon={<Smile size={20} color="#fbbf24" />} label="Feeling" onClick={() => setShowFeelings(!showFeelings)} />
                            {showFeelings && (
                                <div style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    padding: '15px',
                                    zIndex: 10000,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '10px',
                                    width: '90%',
                                    maxWidth: '300px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                                }}>
                                    <h4 style={{ gridColumn: 'span 2', textAlign: 'center', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>How are you feeling?</h4>
                                    {FEELINGS_LIST.map(f => (
                                        <div
                                            key={f}
                                            onClick={() => { setFeeling(f); setShowFeelings(false); }}
                                            style={{
                                                padding: '12px',
                                                cursor: 'pointer',
                                                borderRadius: '12px',
                                                color: 'white',
                                                background: 'rgba(255,255,255,0.05)',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                transition: '0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        >
                                            {f}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setShowFeelings(false)}
                                        style={{
                                            gridColumn: 'span 2',
                                            marginTop: '10px',
                                            padding: '10px',
                                            border: 'none',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <ActionButton icon={<MapPin size={20} color="#ef4444" />} label="Location" onClick={addLocation} />
                        <ActionButton icon={<Smile size={20} color="#6366f1" />} label="Post a Joke" onClick={postAJoke} />
                    </div>
                </div>
            </div>

            {/* Feed List */}
            {sortedPosts.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                    <h3>No posts yet</h3>
                    <p>Be the first to share something with your family!</p>
                </div>
            ) : sortedPosts.map(post => (
                <div key={post.id} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <img src={post.avatar} style={{ width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover' }} />
                            <div>
                                <h4 style={{ margin: 0, fontWeight: '600', color: 'white' }}>
                                    {post.author}
                                    {post.feeling && <span style={{ fontWeight: 'normal', color: '#cbd5e1' }}> is feeling {post.feeling}</span>}
                                    {post.location && <span style={{ fontWeight: 'normal', color: '#cbd5e1' }}> at {post.location}</span>}
                                </h4>
                                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                                    {formatDistanceToNow(post.timestamp)} ago
                                </span>
                            </div>
                        </div>
                        <MoreHorizontal size={20} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} />
                    </div>

                    <p style={{ marginBottom: '16px', fontSize: '16px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>{post.content}</p>

                    {post.image && (
                        <div style={{ margin: '0 -24px 16px -24px' }}>
                            <img src={post.image} style={{ width: '100%', display: 'block' }} />
                        </div>
                    )}
                    {post.video && (
                        <div style={{ margin: '0 -24px 16px -24px', background: 'black', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            {/* Simple video placeholder player if not a valid video file */}
                            <video src={post.video} controls style={{ width: '100%' }} onError={(e) => e.target.style.display = 'none'} />
                            <div style={{ position: 'absolute', pointerEvents: 'none', top: 10, left: 10, fontSize: '10px', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px' }}>Video</div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '16px' }}>
                        <div>{getReactionSummary(post.likes)}</div>
                        <span>{(post.comments || []).length} Comments</span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-around', position: 'relative' }}>
                        <ReactionPicker
                            onReact={(type) => store.likePost(post.id, user.id, type)}
                            currentReaction={(post.likes || []).map(l => typeof l === 'string' ? { userId: l, type: 'like' } : l).find(l => l.userId === user?.id)?.type}
                        />
                        <ActionButton icon={<MessageSquare size={20} />} label="Comment" onClick={() => {
                            const txt = prompt("Write a comment:");
                            if (txt) store.addComment(post.id, { id: Date.now(), user: user.name, text: txt });
                        }} />
                        <ActionButton icon={<Share2 size={20} />} label="Facebook" onClick={() => shareToSocial(post)} />
                    </div>

                    {/* Comments */}
                    {(post.comments || []).length > 0 && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
                            {(post.comments || []).map(c => (
                                <div key={c.id} style={{ fontSize: '14px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '600', color: 'white' }}>{c.user}: </span>
                                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{c.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function ReactionPicker({ onReact, currentReaction }) {
    const [hover, setHover] = useState(false);

    // Icons
    const ICONS = {
        like: <ThumbsUp size={20} />,
        love: <span style={{ fontSize: '20px' }}>❤️</span>,
        haha: <span style={{ fontSize: '20px' }}>😂</span>,
        wow: <span style={{ fontSize: '20px' }}>😮</span>,
        sad: <span style={{ fontSize: '20px' }}>😢</span>,
        angry: <span style={{ fontSize: '20px' }}>😡</span>
    };

    const LABELS = { like: 'Like', love: 'Love', haha: 'Haha', wow: 'Wow', sad: 'Sad', angry: 'Angry' };

    return (
        <div
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <AnimatePresence>
                {hover && (
                    <div style={{
                        position: 'absolute', bottom: '100%', left: 0,
                        background: 'white', padding: '5px', borderRadius: '30px',
                        display: 'flex', gap: '5px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                        marginBottom: '10px', zIndex: 100
                    }}>
                        {Object.keys(ICONS).map(type => (
                            <motion.button
                                key={type}
                                whileHover={{ scale: 1.2, y: -5 }}
                                onClick={() => { onReact(type); setHover(false); }}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}
                                title={LABELS[type]}
                            >
                                {ICONS[type]}
                            </motion.button>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <ActionButton
                icon={currentReaction ? ICONS[currentReaction] : <ThumbsUp size={20} />}
                label={currentReaction ? LABELS[currentReaction] : "Like"}
                onClick={() => onReact('like')}
                isActive={!!currentReaction}
            />
        </div>
    );
}

function ActionButton({ icon, label, onClick, isActive }) {
    return (
        <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            padding: '8px 24px',
            borderRadius: '8px',
            color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: '0.2s'
        }}
            onClick={onClick}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span>{label}</span>
        </button>
    )
}

function BirthdayHero({ store, currentUser }) {
    // Find users with birthday today
    const today = new Date();
    const birthdayUsers = store.users.filter(u => {
        if (!u.birthday) return false;
        // Parse YYYY-MM-DD
        const [year, month, day] = u.birthday.split('-').map(Number);
        // Note: Months are 0-indexed in JS Date, but usually 1-indexed in input strings.
        // Let's assume input is standard YYYY-MM-DD (1-12)
        return (month - 1) === today.getMonth() && day === today.getDate();
    });

    if (birthdayUsers.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {birthdayUsers.map(u => (
                <BirthdayCard key={u.id} user={u} store={store} currentUser={currentUser} />
            ))}
        </div>
    );
}

function BirthdayCard({ user, store, currentUser }) {
    const [wish, setWish] = useState('');

    const sendWish = () => {
        if (!wish.trim()) return;

        // Post the wish to the feed
        store.addPost({
            id: Date.now(),
            author: currentUser.name,
            authorId: currentUser.id,
            avatar: currentUser.avatar,
            content: `🎉 Happy Birthday ${user.name}! 🎂 ${wish}`,
            image: null,
            video: null,
            likes: [],
            comments: [],
            timestamp: Date.now(),
            type: 'birthday_wish',
            taggedUser: user.id
        });

        setWish('');
        alert("Birthday wish sent!");
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
                background: 'linear-gradient(135deg, #1e1e2e, #2e1065)',
                borderRadius: '24px',
                padding: '2px', // Border gradient
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, #f43f5e, #8b5cf6, #3b82f6)',
                opacity: 0.5,
                filter: 'blur(20px)'
            }}></div>

            <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '22px',
                padding: '30px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '25px',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Visuals */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(45deg, #ffd700, #f43f5e)',
                        padding: '4px',
                        boxShadow: '0 10px 30px rgba(244, 63, 94, 0.4)'
                    }}>
                        <img src={user.avatar || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1e293b' }} />
                    </div>
                    <div style={{
                        position: 'absolute', top: -10, right: -10,
                        background: '#ffd700', color: '#be185d',
                        width: '32px', height: '32px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', boxShadow: '0 5px 15px rgba(255, 215, 0, 0.5)'
                    }}>
                        🎂
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '24px', color: 'white', fontWeight: '800' }}>
                        Happy Birthday, <span style={{ background: 'linear-gradient(90deg, #f472b6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name}</span>!
                    </h3>
                    <p style={{ margin: '5px 0 15px 0', color: '#cbd5e1', fontSize: '14px' }}>
                        It's their special day! Send some love and make their day brighter. ✨
                    </p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            value={wish}
                            onChange={(e) => setWish(e.target.value)}
                            placeholder="Write a sweet birthday message..."
                            onKeyDown={e => e.key === 'Enter' && sendWish()}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '10px 16px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={sendWish}
                            style={{
                                background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0 20px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 5px 15px rgba(244, 63, 94, 0.3)'
                            }}
                        >
                            <Gift size={18} /> Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Confetti (CSS only for perf) */}
            <style>{`
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
            `}</style>
        </motion.div>
    );
}

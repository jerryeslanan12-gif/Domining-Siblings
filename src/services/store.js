import { useState, useEffect } from 'react';

const KEYS = {
    USERS: 'ds_users',
    POSTS: 'ds_posts',
    MESSAGES: 'ds_messages',
    TREE: 'ds_tree',
    CURRENT_USER: 'ds_current_user',
    ONLINE_STATUS: 'ds_online_status',
    MEETINGS: 'ds_meetings',
    SETTINGS: 'ds_settings',
    EMERGENCIES: 'ds_emergencies',
    GOALS: 'ds_goals'
};

const defaultSettings = {
    wisdomPopup: true,
    theme: 'light'
};

const getStore = () => {
    try {
        return {
            users: JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
            posts: JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]'),
            messages: JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]'),
            tree: JSON.parse(localStorage.getItem(KEYS.TREE) || '[]'),
            online: JSON.parse(localStorage.getItem(KEYS.ONLINE_STATUS) || '{}'),
            meetings: JSON.parse(localStorage.getItem(KEYS.MEETINGS) || '[]'),
            settings: JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(defaultSettings)),
            emergencies: JSON.parse(localStorage.getItem(KEYS.EMERGENCIES) || '[]'),
            goals: JSON.parse(localStorage.getItem(KEYS.GOALS) || '[]')
        };
    } catch {
        return { users: [], posts: [], messages: [], tree: [], online: {}, meetings: [], settings: defaultSettings, emergencies: [], goals: [] };
    }
};

const setStore = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage-update'));
};

export function useStore() {
    const [data, setData] = useState(getStore());

    // --- Sync Logic ---
    const syncWithCloud = async () => {
        if (!navigator.onLine) return;
        try {
            const currentLocal = getStore();
            // We use /api/sync which merges everything
            const res = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentLocal)
            });

            if (res.ok) {
                const cloudData = await res.json();

                // Update local storage if cloud has new stuff
                // To avoid infinite loops, we only set if data is different
                if (JSON.stringify(cloudData) !== JSON.stringify(currentLocal)) {
                    Object.keys(cloudData).forEach(key => {
                        const storageKey = KEYS[key.toUpperCase()];
                        if (storageKey) {
                            localStorage.setItem(storageKey, JSON.stringify(cloudData[key]));
                        }
                    });
                    // Settings is special in KEYS
                    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(cloudData.settings || currentLocal.settings));

                    window.dispatchEvent(new Event('storage-update'));
                }
            }
        } catch (e) {
            console.error("Cloud Sync Error:", e);
        }
    };

    useEffect(() => {
        const handleStorage = () => setData(getStore());

        window.addEventListener('storage', handleStorage);
        window.addEventListener('storage-update', handleStorage);

        // Initial Sync
        syncWithCloud();

        // Auto-sync polling every 5 seconds
        const syncInterval = setInterval(syncWithCloud, 5000);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('storage-update', handleStorage);
            clearInterval(syncInterval);
        };
    }, []);

    // ... actions definition ...

    // To make sure we can process queue from the effect above, we could ideally restructure.
    // However, to keep edits minimal: actions are recreated every render which is fine.
    // We will add a listener for the custom sync event inside the hook if we want `useStore` to drive it, 
    // OR just let the App.jsx drive the sync. 

    // Let's rely on App.jsx to call store.processQueue() when online event fires.

    const actions = {
        login: (user) => {
            const users = getStore().users;
            let existing = users.find(u => u.email === user.email);

            if (!existing) {
                existing = {
                    ...user,
                    id: 'u_' + Date.now(),
                    birthday: '',
                    address: '',
                    contact: '',
                    children: [],
                    bio: '',
                    medical: { bloodType: '', allergies: '', conditions: '', notes: '' },
                    photos: [],
                    isOnline: true,
                    isAdmin: users.length === 0 // First user is Admin
                };
                users.push(existing);
                setStore(KEYS.USERS, users);
            } else if (users.indexOf(existing) === 0 && !existing.isAdmin) {
                // Double check legacy first user is admin
                existing.isAdmin = true;
                setStore(KEYS.USERS, users);
            }

            const online = getStore().online;
            online[existing.id] = Date.now();
            setStore(KEYS.ONLINE_STATUS, online);

            localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(existing));
            return existing;
        },

        logout: (userId) => {
            const online = getStore().online;
            delete online[userId];
            setStore(KEYS.ONLINE_STATUS, online);
            localStorage.removeItem(KEYS.CURRENT_USER);
        },

        deleteUser: (targetId) => {
            const users = getStore().users.filter(u => u.id !== targetId);
            setStore(KEYS.USERS, users);

            const tree = getStore().tree.filter(n => n.userId !== targetId);
            setStore(KEYS.TREE, tree);

            const online = getStore().online;
            delete online[targetId];
            setStore(KEYS.ONLINE_STATUS, online);

            // Re-broadcast
            window.dispatchEvent(new Event('storage-update'));
        },

        updateHeartbeat: (userId) => {
            if (!userId) return;
            const online = getStore().online;
            online[userId] = Date.now();
            setStore(KEYS.ONLINE_STATUS, online);
        },

        updateUser: (updatedUser) => {
            const users = getStore().users.map(u => u.id === updatedUser.id ? updatedUser : u);
            setStore(KEYS.USERS, users);

            const current = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || '{}');
            if (current.id === updatedUser.id) {
                localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage-update'));
            }

            // Sync with tree
            const tree = getStore().tree;
            const treeIndex = tree.findIndex(node => node.userId === updatedUser.id);
            if (treeIndex !== -1) {
                tree[treeIndex] = { ...tree[treeIndex], name: updatedUser.name, img: updatedUser.avatar };
                setStore(KEYS.TREE, tree);
            }
        },

        updateSettings: (newSettings) => {
            const current = getStore().settings;
            setStore(KEYS.SETTINGS, { ...current, ...newSettings });
        },

        // Posts
        // Removed duplicate addPost

        likePost: (postId, userId, type = 'like') => {
            const posts = getStore().posts.map(p => {
                if (p.id === postId) {
                    let likes = p.likes || [];
                    // Normalize old string likes to objects on-the-fly
                    likes = likes.map(l => typeof l === 'string' ? { userId: l, type: 'like' } : l);

                    const existingIndex = likes.findIndex(l => l.userId === userId);

                    if (existingIndex >= 0) {
                        const existing = likes[existingIndex];
                        if (existing.type === type) {
                            // Toggle off if clicking same reaction
                            return { ...p, likes: likes.filter(l => l.userId !== userId) };
                        } else {
                            // Change reaction type
                            const newLikes = [...likes];
                            newLikes[existingIndex] = { userId, type };
                            return { ...p, likes: newLikes };
                        }
                    }

                    // Add new reaction
                    return { ...p, likes: [...likes, { userId, type }] };
                }
                return p;
            });
            setStore(KEYS.POSTS, posts);
        },

        addComment: (postId, comment) => {
            const posts = getStore().posts.map(p => {
                if (p.id === postId) {
                    return { ...p, comments: [...(p.comments || []), comment] };
                }
                return p;
            });
            setStore(KEYS.POSTS, posts);
        },

        // Offline Queue Logic
        addToQueue: (actionType, payload) => {
            const queue = JSON.parse(localStorage.getItem('ds_offline_queue') || '[]');
            queue.push({ id: Date.now(), type: actionType, payload, timestamp: Date.now() });
            localStorage.setItem('ds_offline_queue', JSON.stringify(queue));
            window.dispatchEvent(new Event('queue-updated'));
        },

        processQueue: () => {
            const queue = JSON.parse(localStorage.getItem('ds_offline_queue') || '[]');
            if (queue.length === 0) return;

            // Process each item
            queue.forEach(item => {
                console.log("Syncing offline action:", item.type);
                if (item.type === 'ADD_POST') actions.addPostInternal(item.payload);
                if (item.type === 'SEND_MESSAGE') actions.sendMessageInternal(item.payload);
                if (item.type === 'ADD_GOAL') actions.addGoalInternal(item.payload);
            });

            // Clear queue
            localStorage.setItem('ds_offline_queue', '[]');
            window.dispatchEvent(new Event('queue-updated'));
        },

        // Internal methods that bypass check
        addPostInternal: (post) => {
            const posts = [post, ...getStore().posts];
            setStore(KEYS.POSTS, posts);
        },
        sendMessageInternal: (msg) => {
            const messages = [...getStore().messages, msg];
            setStore(KEYS.MESSAGES, messages);
        },
        addGoalInternal: (goal) => {
            const goals = [goal, ...getStore().goals];
            setStore(KEYS.GOALS, goals);
        },

        // Public methods with offline check
        addPost: (post) => {
            if (!navigator.onLine) {
                actions.addToQueue('ADD_POST', post);
                return 'queued';
            }
            actions.addPostInternal(post);
        },

        sendMessage: (msg) => {
            if (!navigator.onLine) {
                actions.addToQueue('SEND_MESSAGE', msg);
                return 'queued';
            }
            actions.sendMessageInternal(msg);
        },

        // Goals
        addGoal: (goal) => {
            if (!navigator.onLine) {
                actions.addToQueue('ADD_GOAL', goal);
                return 'queued';
            }
            actions.addGoalInternal(goal);
        },

        updateGoal: (updatedGoal) => {
            const goals = getStore().goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
            setStore(KEYS.GOALS, goals);
        },

        addMeeting: (meeting) => {
            const meetings = [meeting, ...getStore().meetings];
            setStore(KEYS.MEETINGS, meetings);
        },

        deleteMeeting: (id) => {
            const meetings = getStore().meetings.filter(m => m.id !== id);
            setStore(KEYS.MEETINGS, meetings);
        },

        // Tree
        addFamilyMember: (member) => {
            const tree = [...getStore().tree, member];
            setStore(KEYS.TREE, tree);
        },

        updateMember: (updatedMember) => {
            const tree = getStore().tree.map(m => m.id === updatedMember.id ? updatedMember : m);
            setStore(KEYS.TREE, tree);
        },

        connectMembers: (parentID, childID) => {
            const tree = getStore().tree.map(node => {
                if (node.id === parentID) {
                    const children = [...(node.children || [])];
                    if (!children.includes(childID)) children.push(childID);
                    return { ...node, children };
                }
                if (node.id === childID) {
                    return { ...node, parent: parentID };
                }
                return node;
            });
            setStore(KEYS.TREE, tree);
        },

        // Emergency
        triggerEmergency: (alert) => {
            const emergencies = [alert, ...getStore().emergencies];
            setStore(KEYS.EMERGENCIES, emergencies);
        },

        resolveEmergency: (id) => {
            const emergencies = getStore().emergencies.map(e => e.id === id ? { ...e, active: false, resolvedAt: Date.now() } : e);
            setStore(KEYS.EMERGENCIES, emergencies);
        },

        addEmergencyChat: (id, msg) => {
            const emergencies = getStore().emergencies.map(e => {
                if (e.id === id) {
                    return { ...e, chat: [...(e.chat || []), msg] };
                }
                return e;
            });
            setStore(KEYS.EMERGENCIES, emergencies);
        },

        respondToEmergency: (id, responder) => {
            // responder: { id, name, status, time }
            const emergencies = getStore().emergencies.map(e => {
                if (e.id === id) {
                    const responders = [...(e.responders || [])];
                    const existingIdx = responders.findIndex(r => r.id === responder.id);
                    if (existingIdx >= 0) {
                        responders[existingIdx] = responder;
                    } else {
                        responders.push(responder);
                    }
                    return { ...e, responders };
                }
                return e;
            });
            setStore(KEYS.EMERGENCIES, emergencies);
        }
    };

    return { ...data, ...actions };
}

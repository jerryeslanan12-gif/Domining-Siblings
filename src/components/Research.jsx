import React, { useState } from 'react';
import { BookOpen, Search, Bot, Globe, Send, ExternalLink, GraduationCap, X } from 'lucide-react';

export default function Research({ user }) {
    const [activeTab, setActiveTab] = useState('web'); // 'web' or 'ai'
    const [searchQuery, setSearchQuery] = useState('');
    const [aiMessages, setAiMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Study Assistant. I can help you research topics, summarize text, or explain complex concepts. What are we learning today?' }
    ]);
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [searchResults, setSearchResults] = useState(null);

    const handleWebSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setSearchResults(null);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults({
                title: "Error",
                content: "Unable to connect to the knowledge base. Please try again later.",
                source: "System"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveKey = () => {
        localStorage.setItem('openai_api_key', apiKey);
        setIsSettingsOpen(false);
    };

    const handleAiSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const userMsg = { role: 'user', content: searchQuery };
        setAiMessages(prev => [...prev, userMsg]);
        setSearchQuery('');
        setIsLoading(true);

        if (!apiKey) {
            setTimeout(() => {
                setAiMessages(prev => [...prev, { role: 'assistant', content: 'Please configure your OpenAI API Key in the settings (top right) to use the live AI features. For now, I can only simulate responses.' }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [...aiMessages, userMsg].map(({ role, content }) => ({ role, content }))
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            const aiResponse = data.choices[0].message.content;
            setAiMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error) {
            setAiMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}. Please check your API Key.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}> {/* Padding for mobile nav */}
            {/* Header */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                        <GraduationCap size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Student Hub</h2>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Research & Learning Center</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="glass-btn secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                    {apiKey ? 'API Configured' : 'Setup AI'}
                </button>
            </div>

            {/* API Key Modal */}
            {isSettingsOpen && (
                <div className="glass-card" style={{ marginBottom: '20px', border: '1px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Configure AI Service</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '15px' }}>
                        Enter your OpenAI API Key to enable the AI Tutor. The key is stored locally on your device.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="password"
                            className="glass-input"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <button onClick={handleSaveKey} className="glass-btn">Save</button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <TabButton
                    active={activeTab === 'web'}
                    onClick={() => setActiveTab('web')}
                    icon={Globe}
                    label="Web Search"
                />
                <TabButton
                    active={activeTab === 'ai'}
                    onClick={() => setActiveTab('ai')}
                    icon={Bot}
                    label="AI Tutor"
                />
            </div>

            {/* Content Area */}
            <div className="glass-card" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>

                {activeTab === 'web' ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', overflowY: 'auto' }}>
                        <Globe size={64} color="var(--primary)" style={{ marginBottom: '20px', opacity: 0.8 }} />
                        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Quick Research</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>
                            Access knowledge instantly via Wikipedia & DuckDuckGo
                        </p>

                        <form onSubmit={handleWebSearch} style={{ maxWidth: '600px', margin: '0 auto', width: '100%', position: 'relative' }}>
                            <div className="input-field" style={{ marginBottom: '0' }}>
                                <Search size={20} />
                                <input
                                    placeholder="What do you want to learn about?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingRight: '50px' }}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        position: 'absolute', right: '5px', top: '5px', bottom: '5px',
                                        background: isLoading ? 'grey' : 'var(--primary)', border: 'none', borderRadius: '10px',
                                        width: '40px', color: 'white', cursor: isLoading ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {isLoading ? <div className="spinner" style={{ width: 15, height: 15, border: '2px solid white', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div> : <Search size={18} />}
                                </button>
                            </div>
                        </form>

                        {searchResults && (
                            <div className="glass-panel" style={{ marginTop: '30px', textAlign: 'left', padding: '25px', animation: 'fadeIn 0.5s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--primary)' }}>{searchResults.title}</h3>
                                    <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px' }}>{searchResults.source}</span>
                                </div>
                                <p style={{ lineHeight: '1.6', fontSize: '15px', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
                                    {searchResults.content}
                                </p>
                                {searchResults.url && (
                                    <a href={searchResults.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '20px', color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                                        Read Full Article <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        )}

                        {!searchResults && (
                            <div style={{ marginTop: '50px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <QuickLink title="Google Scholar" url="https://scholar.google.com" />
                                <QuickLink title="Wikipedia" url="https://wikipedia.org" />
                                <QuickLink title="WolframAlpha" url="https://www.wolframalpha.com" />
                                <QuickLink title="Khan Academy" url="https://www.khanacademy.org" />
                            </div>
                        )}

                        <style>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                        `}</style>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Chat History */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {aiMessages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                                    color: 'white',
                                    fontSize: '15px',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ alignSelf: 'flex-start', color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginLeft: '10px' }}>
                                    AI is typing...
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                            <form onSubmit={handleAiSubmit} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    className="glass-input"
                                    placeholder="Ask anything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="glass-btn" style={{ padding: '0 20px' }}>
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                background: active ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                border: active ? '1px solid var(--primary-dark)' : '1px solid transparent',
                padding: '12px',
                borderRadius: '12px',
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
            }}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function QuickLink({ title, url }) {
    return (
        <a href={url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div className="glass-panel" style={{ padding: '15px 25px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', /*hover*/ }}>
                {title}
            </div>
        </a>
    )
}

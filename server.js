import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from Vite build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Initial data
const DEFAULT_DATA = {
    users: [],
    posts: [],
    messages: [],
    tree: [],
    meetings: [],
    emergencies: [],
    goals: []
};

// Helper: Read DB
function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
            return DEFAULT_DATA;
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        console.error("Error reading DB", e);
        return DEFAULT_DATA;
    }
}

// Helper: Write DB
function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error writing DB", e);
    }
}

// Minimal merge: Server is source of truth for items with IDs
function mergeData(clientData, serverData) {
    const mergeCollection = (client, server) => {
        const merged = [...server];
        client.forEach(cItem => {
            const idx = merged.findIndex(sItem => sItem.id === cItem.id);
            if (idx === -1) {
                merged.push(cItem);
            } else {
                // Keep the one with later timestamp if available
                if (cItem.timestamp > merged[idx].timestamp) {
                    merged[idx] = cItem;
                }
            }
        });
        return merged;
    };

    return {
        users: mergeCollection(clientData.users || [], serverData.users || []),
        posts: mergeCollection(clientData.posts || [], serverData.posts || []),
        messages: mergeCollection(clientData.messages || [], serverData.messages || []),
        tree: mergeCollection(clientData.tree || [], serverData.tree || []),
        meetings: mergeCollection(clientData.meetings || [], serverData.meetings || []),
        emergencies: mergeCollection(clientData.emergencies || [], serverData.emergencies || []),
        goals: mergeCollection(clientData.goals || [], serverData.goals || [])
    };
}

// API Endpoints
app.get('/api/store', (req, res) => {
    res.json(readDB());
});

// Search Proxy Endpoint (avoids CORS issues)
app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter required' });
    }

    try {
        // Try Wikipedia first
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        const wikiResponse = await fetch(wikiUrl);

        if (wikiResponse.ok) {
            const wikiData = await wikiResponse.json();
            if (wikiData.extract) {
                return res.json({
                    source: 'Wikipedia',
                    title: wikiData.title,
                    content: wikiData.extract,
                    url: wikiData.content_urls?.desktop?.page || ''
                });
            }
        }
    } catch (error) {
        console.log('Wikipedia search failed:', error.message);
    }

    try {
        // Fallback to DuckDuckGo
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
        const ddgResponse = await fetch(ddgUrl);

        if (ddgResponse.ok) {
            const ddgData = await ddgResponse.json();

            if (ddgData.AbstractText) {
                return res.json({
                    source: ddgData.AbstractSource || 'Web Search',
                    title: ddgData.Heading || query,
                    content: ddgData.AbstractText,
                    url: ddgData.AbstractURL || ''
                });
            }

            // Check for related topics
            if (ddgData.RelatedTopics && ddgData.RelatedTopics.length > 0) {
                const firstTopic = ddgData.RelatedTopics[0];
                if (firstTopic.Text) {
                    return res.json({
                        source: 'DuckDuckGo',
                        title: firstTopic.FirstURL ? firstTopic.FirstURL.split('/').pop().replace(/_/g, ' ') : query,
                        content: firstTopic.Text,
                        url: firstTopic.FirstURL || ''
                    });
                }
            }
        }
    } catch (error) {
        console.log('DuckDuckGo search failed:', error.message);
    }

    // Fallback response
    res.json({
        source: 'Knowledge Base',
        title: query,
        content: `I searched for "${query}" but couldn't find specific information from external sources at the moment.\n\nHere's what I can tell you:\n\n**General Information:**\nThis topic may require more specific search terms or could be a specialized subject. Try:\n- Being more specific with your question\n- Breaking down complex topics into smaller questions\n- Using different keywords or phrases\n\n**Tip:** I work best with questions like:\n- "What is [concept]?"\n- "Who was [person]?"\n- "How does [process] work?"\n- "When did [event] happen?"`,
        url: ''
    });
});

app.post('/api/sync', (req, res) => {
    const currentData = readDB();
    const merged = mergeData(req.body, currentData);
    writeDB(merged);
    res.json(merged);
});

// Fallback to index.html for React Router
app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Domining Multi-Device Server running on port ${PORT}`);
});

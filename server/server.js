const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path'); // 1. Add this line

const app = express();
const SECRET_KEY = "supersecretkey";

// Middleware
app.use(express.json());
app.use(cors());

// 2. Add this line to serve your client files
app.use(express.static(path.join(__dirname, '../client')));

// ... keep the rest of your routes (register, login, etc) as they were

// Helper functions for JSON file
const getData = () => {
    try {
        return JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    } catch (err) {
        return { users: [], solutions: [] };
    }
};

const saveData = (data) => {
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Access Denied");
    try {
        req.user = jwt.verify(token.split(" ")[1], SECRET_KEY);
        next();
    } catch { res.status(400).send("Invalid Token"); }
};

// --- Routes ---

// Register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const data = getData();
    const hashedPassword = await bcrypt.hash(password, 10);
    data.users.push({ username, password: hashedPassword });
    saveData(data);
    res.status(201).send("User registered");
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const data = getData();
    const user = data.users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        res.json({ token });
    } else res.status(401).send("Invalid credentials");
});

// Get All Solutions
app.get('/solutions', (req, res) => {
    res.json(getData().solutions);
});

// Add Solution
app.post('/solutions', authenticate, (req, res) => {
    const data = getData();
    const newSolution = { 
        id: Date.now(), 
        title: req.body.title, 
        description: req.body.description, 
        upvotes: 0 
    };
    data.solutions.push(newSolution);
    saveData(data);
    res.status(201).json(newSolution);
});

// Upvote
app.post('/solutions/:id/upvote', authenticate, (req, res) => {
    const data = getData();
    const sol = data.solutions.find(s => s.id == req.params.id);
    if (sol) {
        sol.upvotes += 1;
        saveData(data);
        res.json(sol);
    } else res.status(404).send("Not found");
});

// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
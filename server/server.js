require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // <--- NEW TOOL
const path = require('path');     // <--- NEW TOOL
const fs = require('fs');         // <--- NEW TOOL
const Event = require('./models/event');
const Setting = require('./models/setting');
const History = require('./models/history');

const app = express();


// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins (Easiest for now)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- 1. SETUP FILE UPLOAD STORAGE ---
// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// GET: Fetch all stories !!Histroy Page
app.get('/api/history', async (req, res) => {
    try {
        const stories = await History.find().sort({ createdAt: 1 });
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Add a new story (Supports URL + Files)
app.post('/api/history', upload.array('historyImages', 5), async (req, res) => {
    try {
        const { tabTitle, title, subtitle, text, imageUrl, retainedImages } = req.body; // 'imageUrl' comes from text input

        let finalImages = [];

        // 0. Handle retained images if sent (usually empty for new post)
        if (retainedImages) {
            finalImages = JSON.parse(retainedImages);
        }

        // 1. Add URL from text input if present
        if (imageUrl && imageUrl.trim() !== "") {
            finalImages.push(imageUrl.trim());
        }

        // 2. Add uploaded files
        if (req.files && req.files.length > 0) {
            const uploadedPaths = req.files.map(file => `https://sri-xpvu.onrender.com/uploads/${file.filename}`);
            finalImages = [...finalImages, ...uploadedPaths];
        }

        // Fallback if absolutely nothing provided
        if (finalImages.length === 0) {
            finalImages.push("https://images.unsplash.com/photo-1604537466158-719b1972feb8?q=80");
        }

        const newStory = new History({
            tabTitle, title, subtitle, text,
            images: finalImages
        });

        const savedStory = await newStory.save();
        res.json(savedStory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Update a story
app.put('/api/history/:id', upload.array('historyImages', 5), async (req, res) => {
    try {
        const { tabTitle, title, subtitle, text, imageUrl, retainedImages } = req.body;

        // 1. Start with the list of old images the user chose to keep
        // (Frontend sends this as a JSON string)
        let finalImages = retainedImages ? JSON.parse(retainedImages) : [];

        // 2. Add NEW URL from text input (if provided)
        if (imageUrl && imageUrl.trim() !== "") {
            finalImages.push(imageUrl.trim());
        }

        // 3. Add NEW Uploaded Files
        if (req.files && req.files.length > 0) {
            const uploadedPaths = req.files.map(file => `https://sri-xpvu.onrender.com/uploads/${file.filename}`);
            finalImages = [...finalImages, ...uploadedPaths];
        }

        // 4. Update Database
        const updatedStory = await History.findByIdAndUpdate(
            req.params.id,
            {
                tabTitle,
                title,
                subtitle,
                text,
                images: finalImages
            },
            { new: true }
        );
        res.json(updatedStory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Delete a story (THIS WAS MISSING)
app.delete('/api/history/:id', async (req, res) => {
    try {
        const result = await History.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: "Story not found" });
        res.json({ message: "Story deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. MAKE UPLOADS PUBLICLY ACCESSIBLE ---
// This lets the frontend view images at: http://localhost:5001/uploads/filename.jpg

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
app.get('/', (req, res) => {
    res.send('Jai Sri Narsingh! Backend is working. Made By - Ajay Pratap');
});
// --- ROUTES ---

app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATED POST ROUTE: Now accepts 'imageFile' or 'image' URL
app.post('/api/events', upload.single('imageFile'), async (req, res) => {
    try {
        const { title, date, description, location, image } = req.body;

        // LOGIC: Did they upload a file? OR did they paste a URL?
        let finalImageUrl = image; // Default to the pasted URL

        if (req.file) {
            // If a file was uploaded, construct the local server URL
            // NOTE: Replace 'localhost:5001' with your Render URL when you deploy!
            finalImageUrl = `https://sri-xpvu.onrender.com/uploads/${req.file.filename}`;
        }

        const newEvent = new Event({
            title,
            date,
            description,
            location,
            image: finalImageUrl // Save the final link
        });

        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE (EDIT) EVENT ---
app.put('/api/events/:id', upload.single('imageFile'), async (req, res) => {
    try {
        const { title, date, description, location, image } = req.body;

        // 1. Prepare the data to update
        let updateData = {
            title,
            date,
            description,
            location
        };

        // 2. Handle Image Logic
        // If a new file is uploaded, use that. 
        // If a text URL is provided, use that.
        // If neither is provided, we don't overwrite 'image' (so the old one stays).
        if (req.file) {
            updateData.image = `https://sri-xpvu.onrender.com/uploads/${req.file.filename}`;
        } else if (image) {
            updateData.image = image;
        }

        // 3. Update the database
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated document
        );

        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- SETTINGS ROUTES ---

// 1. GET a specific setting (like the default image)
app.get('/api/settings/:key', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        // If setting exists, return it. If not, return empty string.
        res.json({ value: setting ? setting.value : "" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. SAVE a setting (Upload or URL)
app.post('/api/settings', upload.single('imageFile'), async (req, res) => {
    try {
        const { key, textValue } = req.body;
        let finalValue = textValue;

        // If a file was uploaded, use that instead
        if (req.file) {
            finalValue = `https://sri-xpvu.onrender.com/uploads/${req.file.filename}`;
        }

        // Find the setting and update it, OR create it if it doesn't exist (upsert)
        const updatedSetting = await Setting.findOneAndUpdate(
            { key: key },
            { value: finalValue },
            { new: true, upsert: true }
        );

        res.json(updatedSetting);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
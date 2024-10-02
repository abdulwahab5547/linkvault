import express, { Router, json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User, { findOne} from './models/user.model.js';
import cors from 'cors';
const app = express();
const router = Router();
import pkg from 'body-parser';
const { json: _json } = pkg;
import token from 'jsonwebtoken';
const { sign, verify } = token;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware

app.use(json());

app.use(cors({
  origin: ["https://linkvault-zeta.vercel.app", "http://localhost:3000"],
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.user = user;
      next();
  });
}

// Routes
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const newUser = new User({ email, username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        const user = await findOne({ 
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Display profile details
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user details
        res.status(200).json({
            username: user.username,
            email: user.email,
            // Add any other fields you want to include
            // For example: 
            // createdAt: user.createdAt,
            // updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile details' });
        console.error('Failed to fetch profile details:', error);
    }
});


// Update user profile
app.put('/api/update-profile', authenticateToken, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userId = req.user.id;

        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password; 

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Failed to update profile:', error);
    }
});


// Add new section

// Fetch sections and links data
app.get('/api/sections', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('sections');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure each section has an id field
        const sectionsWithIds = user.sections.map(section => ({
            ...section.toObject(),
            id: section._id || section.id // Use _id if available, otherwise fallback to id
        }));

        res.status(200).json({ sections: sectionsWithIds });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Failed to fetch sections and links:', error);
    }
});

app.post('/api/add-section', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid section name' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newSection = {
            id: Date.now().toString(), // Generate a unique ID
            name: name,
            links: [] // Initialize with an empty array
        };

        // Use $push operator to add the new section
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { sections: newSection } },
            { new: true, runValidators: false }
        );

        res.status(201).json({ message: 'Section added successfully', section: newSection });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Failed to add new link section:', error);
    }
});

// Delete a section
app.delete('/api/delete-section/:sectionId', authenticateToken, async (req, res) => {
    try {
        const { sectionId } = req.params;

        if (!sectionId) {
            return res.status(400).json({ message: 'Invalid section ID' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the section to be deleted
        const sectionIndex = user.sections.findIndex(section => section._id.toString() === sectionId);

        if (sectionIndex === -1) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Remove the section from the array
        user.sections.splice(sectionIndex, 1);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Failed to delete section:', error);
    }
});


// Update section name
app.put('/api/update-section/:sectionId', authenticateToken, async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { name } = req.body;

        if (!sectionId || !name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid section ID or name' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const section = user.sections.id(sectionId);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        section.name = name;
        await user.save();

        res.status(200).json({ message: 'Section name updated successfully', section });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Failed to update section name:', error);
    }
});


// Add a new link to a section
app.post('/api/add-link', authenticateToken, async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const { sectionId, title, url } = req.body;

        if (!sectionId || !title || !url) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const section = user.sections.id(sectionId);

        if (!section) {
            // Try finding the section by index if id() method fails
            const sectionIndex = user.sections.findIndex(s => s._id.toString() === sectionId);
            if (sectionIndex === -1) {
                return res.status(404).json({ message: 'Section not found' });
            }
            section = user.sections[sectionIndex];
        }

        const newLink = {
            title: title,
            url: url
        };

        section.links.push(newLink);
        await user.save();

        res.status(201).json({ message: 'Link added successfully', link: newLink });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Failed to add new link:', error);
    }
});

// Delete a link
app.delete('/api/delete-link/:linkId', authenticateToken, async (req, res) => {
    try {
        const { linkId } = req.params;

        if (!linkId) {
            return res.status(400).json({ message: 'Missing link ID' });
        }

        // Validate if linkId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(linkId)) {
            return res.status(400).json({ message: 'Invalid link ID format' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let linkDeleted = false;

        // Iterate through sections to find and remove the link
        for (let section of user.sections) {
            const linkIndex = section.links.findIndex(link => link._id.toString() === linkId);
            if (linkIndex !== -1) {
                section.links.splice(linkIndex, 1);
                linkDeleted = true;
                break;  // Exit the loop once the link is found and deleted
            }
        }

        if (!linkDeleted) {
            return res.status(404).json({ message: 'Link not found' });
        }

        await user.save();

        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Failed to delete link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a link
app.put('/api/update-link/:linkId', authenticateToken, async (req, res) => {
    try {
        const { linkId } = req.params;
        const { title, url } = req.body;

        if (!linkId || !title || !url) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate if linkId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(linkId)) {
            return res.status(400).json({ message: 'Invalid link ID format' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let linkUpdated = false;

        // Iterate through sections to find and update the link
        for (let section of user.sections) {
            const linkIndex = section.links.findIndex(link => link._id.toString() === linkId);
            if (linkIndex !== -1) {
                section.links[linkIndex].title = title;
                section.links[linkIndex].url = url;
                linkUpdated = true;
                break;  // Exit the loop once the link is found and updated
            }
        }

        if (!linkUpdated) {
            return res.status(404).json({ message: 'Link not found' });
        }

        await user.save();

        res.json({ message: 'Link updated successfully' });
    } catch (error) {
        console.error('Failed to update link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Search API
app.get('/api/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const searchResults = [];

        // Iterate through sections and links to find matches
        user.sections.forEach(section => {
            section.links.forEach(link => {
                if (link.title.toLowerCase().includes(q.toLowerCase())) {
                    searchResults.push({
                        id: link._id,
                        title: link.title,
                        url: link.url
                    });
                }
            });
        });

        res.json(searchResults);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'An error occurred during search' });
    }
});
  


// Example routes
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/something', (req, res) => res.send('Hello something something!'));

// Final middleware: mount the router
app.use('/api', router);

// Generatetoken function
function generateToken(user) {
    return sign({ id: user.id}, SECRET_KEY, {
        expiresIn: '100d',
    });
}

// Connect to MongoDB and start server
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server running on port ${port}`));
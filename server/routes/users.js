const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT api/users/profile
// @desc    Update user profile (including personality)
// @access  Private
router.put('/profile', auth, userController.updateProfile);

// @route   GET api/users/:id
// @desc    Get specific user profile (with privacy check)
// @access  Private
router.get('/:id', auth, userController.getUserById);

// @route   POST api/users/subscribe
// @desc    Simulate Subscription Payment
// @access  Private
const upload = require('../middleware/upload');

// @route   POST api/users/upload
// @desc    Upload file (photo/doc)
// @access  Private
router.post('/upload', auth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // Return the path relative to client public
        // Since we saved to ../client/public/uploads/, the url is /uploads/filename
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ filePath });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/subscribe', auth, userController.subscribe);

module.exports = router;

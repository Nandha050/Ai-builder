const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        if(user) {
            res.cookie('token', generateToken(user.id), {
    httpOnly: true,
    secure: false, // set true in production (https)
    sameSite: 'lax', // prevents CSRF issues
    maxAge: 30*24*60*60*1000 // 30 days
}).status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email
});    
       
        } else {
            res.status(400).json({ message: "Invalid user data" });

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {
            res.cookie('token', generateToken(user.id), {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 30*24*60*60*1000
}).json({
    _id: user.id,
    name: user.name,
    email: user.email
});
           
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

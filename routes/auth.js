const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.post(
    "/signin",
    [
        check("username", "Username is required").not().isEmpty(),
        check("password", "Password is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (!user) {
                return res
                    .status(401)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }
);

router.post(
    "/signup",
    [
        check("username", "Username with 6 or more characters").isLength({
            min: 4,
        }),
        check("password", "Password with 6 or more characters").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ username: req.body.username });
        if (user) {
            return res
                .status(409)
                .json({ errors: [{ msg: "User already exists" }] });
        }

        const { username, password } = req.body;

        user = new User({
            username,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(200).json({ token });
    }
);

module.exports = router;

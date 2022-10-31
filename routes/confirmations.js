const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { validationResult, check } = require("express-validator");

const Confirmation = require("../models/Confirmation");

router.post(
    "/",
    [
        [
            check("answer", "Answer is required").not().isEmpty(),
            check("fullName", "Full name is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const confirmationFields = req.body;

        try {
            const confirmation = new Confirmation(confirmationFields);
            await confirmation.save();

            res.status(200).json(confirmation);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }
);

router.get("/", async (req, res) => {
    try {
        const confirmations = await Confirmation.find();
        res.status(200).json(confirmations);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Confirmation.findByIdAndDelete(req.params.id);
        const confirmations = await Confirmation.find();
        res.status(200).json(confirmations);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

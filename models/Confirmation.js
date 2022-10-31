const mongoose = require("mongoose");

const ConfirmationSchema = new mongoose.Schema({
    answer: {
        type: Boolean,
        required: true,
    },
    fullName: {
        type: String,
        trim: true,
        required: true,
    },
    message: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("collectionconfirmations", ConfirmationSchema);

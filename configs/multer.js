const multer = require('multer');
const DatauriParser = require('datauri/parser'); // Correct import
const path = require('path');

// Configure memory storage
const storage = multer.memoryStorage();

// Create multer upload middleware
const multerUploads = multer({ storage }).single('image');

// Initialize DatauriParser
const parser = new DatauriParser();

/**
 * @description This function converts the buffer to data URL
 * @param {Object} req containing the field object
 * @returns {String} The data URL from the string buffer
 */
const dataUri = (req) => {
    if (req.file) {
        return parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);
    }
    return null;
};

module.exports = { multerUploads, dataUri };

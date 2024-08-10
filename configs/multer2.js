const multer = require('multer');
const DatauriParser = require('datauri/parser');
const path = require('path');

// Initialize DatauriParser
const parser = new DatauriParser();

// Set up memory storage for multer
const storage = multer.memoryStorage();
const multerUploadds = multer({ storage }).single('articlePic');

/**
 * @description This function converts the buffer to data URL
 * @param {Object} req containing the field object
 * @returns {String} The data URL from the string buffer
 */
const dataUUri = (req) => {
    if (!req.file || !req.file.originalname || !req.file.buffer) {
        throw new Error("Invalid file upload");
    }

    const extname = path.extname(req.file.originalname).toString();
    if (!extname) {
        throw new Error("File extension could not be determined");
    }

    const dataUriContent = parser.format(extname, req.file.buffer).content;

    // Debugging log: Check the content generated
    console.log("Generated Data URI: ", dataUriContent);

    return dataUriContent;
};

module.exports = { multerUploadds, dataUUri };

const cloudinary = require('cloudinary').v2; // Use .v2 to access the latest API version

const cloudinaryConfig = {
    cloud_name: 'dy4izbbfp',
    api_key: '247199398793383',
    api_secret: 'CL4cfIr4Llvg3Wg8SSD4OhLlkbs'
};

// Configure Cloudinary
cloudinary.config(cloudinaryConfig);

// Export the configured cloudinary instance and uploader
module.exports = {
    cloudinary,
    uploader: cloudinary.uploader
};

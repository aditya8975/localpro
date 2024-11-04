
const cloudinaryModule = require("cloudinary");

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
    cloud_name: "dikmbdthi",
    api_key: "297752252281825",
    api_secret: "hjwa970FOfaYgsdY_MZwVGnPCJ4",
});

module.exports = cloudinary;

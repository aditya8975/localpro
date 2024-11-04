const express = require("express");
const router = express.Router();
const { getAllUsers, userDetails, } = require("../controller/userController");
const {User} = require('../models/model')
const { handymanDetails, getAllHandyman } = require("../controller/handymanController");
const authenticateToken = require('../controller/auth'); // Adjust the path if necessary

// route prefix: "/api"
router.route("/user/getallusers").get(getAllUsers);
router.route("/user/getuser").post(userDetails);

router.route("/handyman/getallhandyman").get(getAllHandyman);
router.route("/handyman/gethandyman").post(handymanDetails);

router.get('/user/profile', authenticateToken, (req, res) => {
    // Assuming req.user contains the authenticated user's information
    const userId = req.user.id; // or however you get the user's ID
    
    // Fetch user from database
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            res.json({
                name: user.name,
                email: user.email,
                address: user.address,
                // Include any other user information you want to send
            });
        })
        .catch(err => res.status(500).json({ message: "Server error.", error: err }));
});

module.exports = router;

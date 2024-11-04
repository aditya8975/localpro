const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const dotenv =require("dotenv");
dotenv.config();
// requiring models
const { User, Otp } = require("../models/model");

// requiring controllers
const { sendOtpMail, sendLoginVerificationMail } = require("./mailController");

// getting jwt token
const JWT_SECRET = process.env.JWT_SECRET;

// route - http://localhost:8080/api/user/login
const logIn = async (req, res) => {
    const { email: Email, password: Password } = req.body;

    try {
        const user = await User.findOne({ email: Email });

        if (!user) {
            return res.status(400).send({ msg: "User not found" });
        }

        const validPassword = await bcrypt.compare(Password, user.password);

        if (validPassword) {
            const Details = {
                email: user.email,
                name: user.username,
            };
            sendLoginVerificationMail(Details);
            return res.status(200).send({
                msg: "Log-In successful!",
                user_id: user.user_id,
            });
        } else {
            return res.status(406).send({ msg: "Invalid password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error" });
    }
};

// route - http://localhost:8080/api/user/signup
const signUp = async (req, res) => {
    const { email: Email } = req.body;

    try {
        const existingUser = await User.findOne({ email: Email });
        if (existingUser) {
            return res.status(400).send({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        // Clearing OTPs for the email
        await Otp.deleteMany({ email: Email });
        console.log("Old OTPs deleted successfully");

        // Generate OTP for new user
        const OTP = otpGenerator.generate(6, { digits: true });
        console.log("Before hashing: ", { email: Email, otp: OTP });

        sendOtpMail(Email, OTP);

        // Encrypting the OTP and saving to Otp_table
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(OTP, salt);

        const newUserLogin = new Otp({
            email: Email,
            otp: hashedOtp,
        });

        await newUserLogin.save();
        console.log("Saved OTP ready for validation");

        return res.status(200).send({ msg: "Otp sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error" });
    }
};

// route - http://localhost:8080/api/user/signup/verify
const verifySignup = async (req, res) => {
    const { contactNumber: number, otp: inputOtp, email: Email, username: name, password: Password, lat: Lat, long: Long } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email: Email });
        if (!otpRecord) {
            return res.status(400).send("The OTP expired. Please try again!");
        }

        const validOtp = await bcrypt.compare(inputOtp, otpRecord.otp);
        if (validOtp) {
            // Encrypting password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);

            // Generating user token
            const token = jwt.sign({ email: Email }, JWT_SECRET);

            // Saving new user
            const newUser = new User({
                user_id: token,
                username: name,
                email: Email,
                contactNumber: number,
                password: hashedPassword,
                lat: Lat,
                long: Long,
            });

            await newUser.save();
            console.log("Signup successful: ", newUser);

            // Clear the OTPs for the email
            await Otp.deleteMany({ email: Email });
            console.log(`OTP table for ${Email} cleared.`);

            return res.status(200).send({
                msg: "Account creation successful!",
                user_id: token,
            });
        } else {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error" });
    }
};

// route - http://localhost:8080/api/user/signup/resendOtp
const resendOtp = async (req, res) => {
    const { email: Email } = req.body;

    try {
        const user = await User.findOne({ email: Email });
        if (!user) {
            return res.status(400).send({
                msg: "This Email ID is not registered. Try Signing Up instead!",
            });
        }

        // Clearing old OTPs
        await Otp.deleteMany({ email: Email });
        console.log("Old OTP deleted successfully");

        // Generate new OTP for the user
        const OTP = otpGenerator.generate(6, { digits: true });
        console.log("New OTP Before hashing: ", { email: Email, otp: OTP });

        sendOtpMail(Email, OTP);

        // Encrypting the OTP and saving to Otp_table
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(OTP, salt);

        const newUserLogin = new Otp({
            email: Email,
            otp: hashedOtp,
        });

        await newUserLogin.save();
        console.log("Saved OTP ready for validation");

        return res.status(200).send({ msg: "New OTP sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error" });
    }
};

// route - http://localhost:8080/api/user/getallusers
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(404).json({ msg: error.message });
    }
};

// route - http://localhost:8080/api/user/getuser
const userDetails = async (req, res) => {
    const { user_id } = req.body;

    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(400).send({ msg: "No such user exists" });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error" });
    }
};

module.exports = {
    signUp,
    verifySignup,
    logIn,
    resendOtp,
    getAllUsers,
    userDetails,
};

const nodemailer = require("nodemailer");
const dotenv =require("dotenv");
dotenv.config();

// to send otp mail
function sendOtpMail(Email, otp) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        auth: {
           user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
        from:process.env.GMAIL_USER, // Corrected from
        to:Email,
        subject: "One Time Password - Local ",
        html: `Please keep your OTP confidential and do not share it with anyone. The OTP will be valid for five minutes only. <br><strong>OTP: ${otp}</strong><br><br>Thank you for choosing Local!<br><br>`,
    };

    console.log(`Sending OTP to: ${Email}, OTP: ${otp}`); // Log to check

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log("Error sending email:", err); // More descriptive error logging
        } else {
            console.log("OTP Email sent successfully");
        }
    });
}

// to send job start otp mail
function sendJobStartOtpMail(Email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port:465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
        from:process.env.GMAIL_USER,
        to: Email,
        subject: "Job Start One Time Password - Local ",
        html: `Please share this OTP with the handyman once he arives. <br><strong>OTP: ${otp}</strong><br><br>Thank you for choosing Local Handyman!<br><br>If you have any questions, please contact us at:<br>Saksham Gupta: saksham.gupta2020@vitbhopal.ac.in.`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Job Start Otp Email sent successfully");
        }
    });
}

// to send Login Verification Mail
function sendLoginVerificationMail(Details) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
        from:process.env.GMAIL_USER,
        to: Details.email,
        subject: `Login Successful - Local `,
        html: `Dear <i>${Details.name}</i>,<br><br>You have successfully logged in to your account at Local ! Thank you for being a part of our community.<br><br>If you have any questions or concerns, please don't hesitate to reach out to us. We're here to help please contact us at:<br>Local: jlee03046@gmail.com<br><br>Best regards,<br>The Local Team`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Login Verification Mail sent successfully");
        }
    });
}

// to send ticket
function sendTicket(Details) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: Details.email,
        subject: `Your Online Event Pass for ${Details.event_name} - Local ✨`,
        html: `Dear <i>${Details.name}</i>,<br><br>Thank you for registering for ${Details.event_name}! We are excited to have you join us and want to make sure that you have all the information you need to have a great time.<br><br>Your online pass has been generated and is ready for you to use. Please remember to keep this pass with you at all times during the event and do not share it with anyone else.<br><br><strong>Pass Number: ${Details.pass}</strong><br><br>Here are the details of your registration:<br>Name: ${Details.name}<br>Amount Paid: ${Details.price}<br>Address: ${Details.address1} <br> City: ${Details.city} <br> PinCode: ${Details.zip}<br><br>If you have any questions or concerns, please don't hesitate to reach out to us. We're here to help please contact us at:<br>Aditya katare:adityakatare35@gmail.com<br><br><br>Best regards,<br>The Local Team`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Ticket Email sent successfully");
        }
    });
}

module.exports = {
    sendOtpMail,
    sendLoginVerificationMail,
    sendTicket,
    sendJobStartOtpMail,
};

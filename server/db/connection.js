const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const LOCAL_URI = " ";

const conn = mongoose.connect(LOCAL_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => {
        console.log("Local MongoDB Connected");
        return db;
    })
    .catch(err => {
        console.log("Connection Error: " + err);
    });

module.exports = conn;

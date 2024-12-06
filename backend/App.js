var express = require("express");
var cors = require("cors");
const path = require("path");
var bodyParser = require("body-parser");
const multer = require('multer')

// MySQL
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "fallstudent",
    password: "fallstudent",
    database: "secoms3190",
});

console.log("logged in")

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });
// Create "uploads" folder if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Server
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically
console.log("aaa")

const port = "8081";
const host = "localhost";

const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db2 = client.db(dbName);

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

app.get("/comments", (req, res) => {
    try {
        db.query("SELECT * FROM thr33_user_comments", (err, result) => {
            if (err) {
                console.error({ error: "Error retrieving all comments:" + err });
                return res.status(500).send({ error: "Error retrieving all comments" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.post("/comments/post", (req, res) => {
    try {
        // Read data from Body
        const { userId, message } = req.body;
        // Query MySQL
        const query = "INSERT INTO thr33_user_comments (commentId, commentMessage, commentTimestamp) VALUES (?, ?, NOW())";
        db.query(query, [contactId, message], (err, results) => {
            if (err) {
                // In case of an error occurs
                console.log("Error in /comments/post " + err);
                res.status(409).send({ error: "Error adding comment " + err });
            } else {
                // If it was successful
                res.status(201).send("Message added successfully");
            }
        });
    } catch (err) {
        console.err("Error in /comments/post " + err);
        res.status(500).send({ error: 'Error sending comment' + err });
    };

});
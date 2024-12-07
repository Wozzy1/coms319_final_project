var express = require("express");
var cors = require("cors");
const path = require("path");
var bodyParser = require("body-parser");
const multer = require('multer')
const { MongoClient } = require("mongodb");

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

app.listen(process.env.PORT || port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

app.get("/users", async (req, res) => {
    try {
        db.query("SELECT * FROM thr33_user", (err, result) => {
            if (err) {
                console.error({ error: "Error retrieving all users:" + err });
                return res.status(500).send({ error: "Error retrieving all users" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.post("/newUser", (req, res) => {
    try {
        // Read data from Body
        const { username, password } = req.body;

        // Check if the user exists
        const query = "SELECT * FROM thr33_user WHERE username = ?";
        db.query(query, [username], (err, results) => {
            if (err) {
                console.error("Error checking if user exists in database:", err);
                return res.status(500).send({ error: "Database error" });
            }

            if (results.length > 0) {
                // User already exists
                return res.status(409).send({ error: "User already exists" });
            }

            // If user doesn't exist, create a new one
            const insertQuery = "INSERT INTO thr33_user (username, password, role) VALUES (?, ?, ?)";
            db.query(insertQuery, [username, password, "user"], (err, results) => {
                if (err) {
                    console.error("Error creating new user:", err);
                    return res.status(500).send({ error: "Error creating user" });
                }

                res.status(201).send({ message: "User created successfully" });
            });
        });
    } catch (error) {
        console.error("Error in /newUser route:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get("/comments", async (req, res) => {
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

app.post("/comments/post", async (req, res) => {
    try {
        // Read data from Body
        const { commentMessage, userId } = req.body;

        // Query MySQL
        const query = "INSERT INTO thr33_user_comments (commentMessage, commentTimestamp, userId) VALUES (?, NOW(), ?)";
        db.query(query, [commentMessage, userId], (err, results) => {
            if (err) {
                // Handle error
                console.log("Error in /comments/post " + err);
                res.status(409).send({ error: "Error adding comment " + err });
            } else {
                // Success
                res.status(201).send("Message added successfully");
            }
        });
            } catch (err) {
        console.err("Error in /comments/post " + err);
        res.status(500).send({ error: 'Error sending comment' + err });
    };

});
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

app.get("/users/list", async (req, res) => {
    try {
        db.query("SELECT * FROM thr33_user", (err, result) => {
            if (err) {
                console.error({ error: "Error retrieving all users:" + err });
                return res.status(500).send({ error: "Error retrieving all users" + err });
            }
            console.log(result);
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        db.query("SELECT * FROM thr33_user WHERE id = ?;", [id], (err, result) => {
            if (err) {
                console.error({ error: `Error retrieving user ${id} ` + err });
                return res.status(500).send({ error: `Error retrieving user ${id} ` + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.delete("/users/delete/:id", async (req, res) => {
    try {
        // first get the id if it's there
        const id = req.params.id;
        db.query("SELECT * FROM thr33_user WHERE id = ?;", [id], (err, result) => {
            if (err) {
                console.error({ error: `Error retrieving user ${id} ` + err });
                return res.status(500).send({ error: `Error retrieving user ${id} ` + err });
            }
            res.status(200).send("User successfully deleted");
            db.query("delete from thr33_user where id = ?;", [id]);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.post("/users/create", (req, res) => {
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

app.get("/comments/list", async (req, res) => {
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

app.get("/comments/:commentId", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        db.query("SELECT * FROM thr33_user_comments where id = ?;", [commentId], (err, result) => {
            if (err) {
                console.error({ error: `Error retrieving comment ${commentId}:` + err });
                return res.status(500).send({ error: `Error retrieving comments ${commentId}` + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.delete("/comments/delete/:commentId", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        console.log("--> " + commentId);
        db.query("SELECT * FROM thr33_user_comments where commentId = ?;", [commentId], (err, result) => {
            if (err) {
                console.error({ error: `Error retrieving comment ${commentId}:` + err });
                return res.status(500).send({ error: `Error retrieving comments ${commentId}` + err });
            }
            res.status(200).send("Comment successfully deleted");
            db.query("delete from thr33_user_comments where commentId = ?;", [commentId]);
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
            console.log(commentMessage, userId);
            if (err) {
                // Handle error
                console.log("Error in /comments/post " + err);
                res.status(409).send({ error: "Error adding comment " + err });
            } else {
                // Success
                res.status(201).send({ message: "Message added successfully" });
            }
        });
    } catch (err) {
        console.err("Error in /comments/post " + err);
        res.status(500).send({ error: 'Error sending comment' + err });
    };

});

app.put("/comments/update/:commentId", async (req, res) => {
    try {
        // Read data from Body
        const { commentMessage, userId } = req.body;
        const { commentId } = req.params; // Get the commentId from the URL parameter

        console.log(commentMessage, userId, commentId);

        // First, check if the user is an admin
        const userQuery = "SELECT role FROM thr33_user WHERE id = ?";
        db.query(userQuery, [userId], (err, results) => {
            if (err) {
                console.log("Error checking if user is admin " + err);
                return res.status(500).send({ error: "Error checking user admin status" });
            }

            // If user is an admin, allow the update regardless
            if (results.length > 0 && results[0].role) {
                // User is admin, proceed with the update
                updateComment();
            } else {
                // If user is not admin, check if the comment belongs to them
                const checkOwnershipQuery = "SELECT userId FROM thr33_user_comments WHERE commentId = ?";
                db.query(checkOwnershipQuery, [commentId], (err, results) => {
                    if (err) {
                        console.log("Error checking comment ownership " + err);
                        return res.status(500).send({ error: "Error checking comment ownership" });
                    }

                    if (results.length === 0) {
                        return res.status(404).send({ error: "Comment not found" });
                    }

                    // If the user is the owner of the comment, proceed with update
                    if (results[0].userId === userId) {
                        updateComment();
                    } else {
                        return res.status(403).send({ error: "Unauthorized to update this comment" });
                    }
                });
            }
        });

        // Function to update the comment
        function updateComment() {
            const query = "UPDATE thr33_user_comments SET commentMessage = ?, commentTimestamp = NOW() WHERE commentId = ?";
            db.query(query, [commentMessage, commentId], (err, results) => {
                if (err) {
                    console.log("Error in /comments/update " + err);
                    res.status(409).send({ error: "Error updating comment " + err });
                } else if (results.affectedRows === 0) {
                    res.status(404).send({ error: "Comment not found" });
                } else {
                    res.status(200).send("Comment updated successfully");
                }
            });
        }

    } catch (err) {
        console.error("Error in /comments/update " + err);
        res.status(500).send({ error: "Error updating comment " + err });
    }
});

app.post("/appointments/schedule", async (req, res) => {
    try {
        // Read data from Body
        const { time_slot, day, user_id } = req.body;

        // Query MySQL
        const query = "INSERT INTO user_time_slots (time_slot, day, user_id) VALUES (?, ?, ?)";
        db.query(query, [time_slot, day, user_id], (err, results) => {
            console.log(time_slot, day, user_id);
            if (err) {
                // Handle error
                console.log("Error in /appointments/schedule " + err);
                res.status(409).send({ error: "Error scheduling time " + err });
            } else {
                // Success
                res.status(201).send("Appointment added successfully");
            }
        });
    } catch (err) {
        console.err("Error in /appointments/schedule " + err);
        res.status(500).send({ error: 'Error scheduling time' + err });
    };

});

app.delete("/appointments/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM user_time_slots WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.log("Error in /appointments/:id (DELETE) " + err);
            res.status(500).send({ error: "Error deleting appointment " + err });
        } else if (results.affectedRows === 0) {
            res.status(404).send({ error: "Appointment not found" });
        } else {
            res.status(200).send("Appointment deleted successfully");
        }
    });
});

app.get("/appointments", (req, res) => {
    const query = "SELECT * FROM user_time_slots";
    db.query(query, (err, results) => {
        if (err) {
            console.log("Error in /appointments (GET) " + err);
            res.status(500).send({ error: "Error fetching appointments " + err });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
});

app.get("/appointments/user/:user_id", (req, res) => {
    const { user_id } = req.params;

    const query = "SELECT * FROM user_time_slots WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.log("Error in /appointments/user/:user_id (GET) " + err);
            res.status(500).send({ error: "Error fetching user appointments " + err });
        } else {
            res.status(200).json(results);
        }
    });
});

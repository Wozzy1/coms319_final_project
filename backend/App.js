var express = require("express");
var cors = require("cors");
const path = require("path");
// var fs = require("fs");
var bodyParser = require("body-parser");
// var app = express();
// app.use(cors());
// app.use(bodyParser.json());

const { MongoClient } = require("mongodb");

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
app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

// endpoint to get all posts
app.get("/contact", (req, res) => {
    // console.log("entered contact");
    try {
        db.query("SELECT * FROM contact", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }


});



// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db2 = client.db(dbName);

app.get("/listRobots", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    // query
    const query = {};
    const results = await db2
        .collection("robot")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.post("/robot", async (req, res) => {
    try {
        await client.connect();
        // The body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Bad request: No data provided.' });
        }
        const newDocument = {
            "id": req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
            "imageUrl": req.body.imageUrl
        };
        console.log(newDocument);

        // Assuming 'id' should be unique
        const existingDoc = await db2
            .collection("robot")
            .findOne({ id: newDocument.id });
        if (existingDoc) {
            return res
                .status(409)
                .send({ error: "Conflict: A robot with this ID already exists." });
        }

        const results = await db2
            .collection("robot")
            .insertOne(newDocument);

        res.status(200);
        res.send(results);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});

app.get("/:id", async (req, res) => {
    const id = Number(req.params.id);   // pay attention that id is a Number in javascript
    console.log("Robot id to find :", id);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { id: id };
    const results = await db2.collection("robot")
        .findOne(query);
    console.log("Results :", results);
    if (!results)
        res.send("Not Found").status(404);
    else {
        res.send(results).status(200);
    }
});


app.delete("/robot/:id", async (req, res) => {
    try {




        // Read parameter id
        const id = Number(req.params.id);
        console.log("Robot to delete :", id);
        // Connect Mongodb
        await client.connect();
        // Delete by its id
        const query = { id: id };
        // Response to Client
        // read data from robot to delete to send it to frontend
        const robotDeleted = await db2.collection("robot").findOne(query);

        // Response to Client
        res.status(200);
        res.send(robotDeleted);
        // Delete
        const results = await db2.collection("robot").deleteOne(query);

        // res.status(200);
        // res.send(results);
    }
    catch (error) {
        console.error("Error deleting robot:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put("/robot/:id", async (req, res) => {
    const id = Number(req.params.id); // Read parameter id
    console.log("Robot to Update :", id);
    await client.connect(); // Connect Mongodb
    const query = { id: id }; // Update by its id
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
        $set: {
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
            "imageUrl": req.body.imageUrl
        }
    };
    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};
    const results = await db2.collection("robot").updateOne(query, updateData, options);
    res.status(200); // Response to Client
    res.send(results);
});


app.post("/contact", upload.single("image"), (req, res) => {
    const { contact_name, phone_number, message } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Step 1: Check if contact_name already exists
    const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
    db.query(checkQuery, [contact_name], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Database error during validation:", checkErr);
            return res.status(500).send({ error: "Error checking contact name: " + checkErr.message });
        }
        if (checkResult.length > 0) {
            // If contact_name exists, send a conflict response
            return res.status(409).send({ error: "Contact name already exists." });
        }

        // Step 2: Insert new contact if validation passed
        const query = "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
        db.query(query, [contact_name, phone_number, message, imageUrl], (err, result) => {
            if (err) {
                console.error("Error adding contact:", err);
                return res.status(500).send({ error: "Error adding contact: " + err.message });
            }
            res.status(201).send("Contact added successfully");
        });
    });
});

app.delete("/contact/:id", (req, res) => {
    try {
        const id = req.params.id;
        const query = "DELETE FROM contact WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ err: "Error deleting contact" });
            } else if (result.affectedRows === 0) {
                res.status(404).send({ err: "Contact not found" });
            } else {
                res.status(200).send("Contact deleted successfully");
            }
        });
    } catch (err) {
        // Handle synchronous errors
        console.error("Error in DELETE /contact:", err);
        res.status(500).send({ error: "An unexpected error occurred in DELETE: " + err.message });
    }
});

app.put("/contact/:id", (req, res) => {
    try {
        const id = req.params.id;
        const query = `
        UPDATE contact
        SET contact_name = ?, phone_number = ?, message = ?
        WHERE id = ?
        `;
        db.query(query, [contact_name, phone_number, message, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ err: "Error updating contact" });
            } else if (result.affectedRows === 0) {
                res.status(404).send({ err: "Contact not found" });
            } else {
                res.status(200).send("Contact updated successfully");
            }
        });
    } catch {
        // Handle synchronous errors
        console.error("Error in UPDATE /contact:", err);
        res.status(500).send({ error: "An unexpected error occurred in UPDATE: " + err.message });
    }
});

app.get("/contact/name", (req, res) => {
    try {
        const { contact_name } = req.query;
        // Validate if contact_name is provided
        if (!contact_name) {
            return res.status(400).send({ error: "contact_name is required" });
        }
        // Query to search for exact or partial matches, case sensitive
        const query = "SELECT * FROM contact WHERE LOWER(contact_name) LIKE LOWER(?)";
        const searchValue = `%${contact_name}%`; // Add wildcards for partial match
        db.query(query, [searchValue], (err, result) => {
            if (err) {
                console.error("Error fetching contacts:", err);
                return res.status(500).send({ error: "Error fetching contacts" });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred in GET by name" + err });
        res.status(500).send({ error: "An unexpected error occurred in GET by name" + err });
    }
});
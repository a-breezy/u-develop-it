const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const inputCheck = require("./utils/inputCheck");

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
	{
		host: "localhost",
		// Your mysql username,
		user: process.env.DB_USER,
		// your mysql password
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
	console.log("Connected to the election database")
);

// gets an array of objects for every candidates data
app.get("/api/candidates", (req, res) => {
	const sql = `SELECT candidates.*, parties.name 
				AS party_name 
				FROM candidates 
				LEFT JOIN parties 
				ON candidates.party_id = parties.id`;

	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: rows,
		});
	});
});

// select particular candidate
app.get("/api/candidates/:id", (req, res) => {
	`SELECT candidates.*, parties.name 
		AS party_name 
		FROM candidates 
		LEFT JOIN parties 
		ON candidates.party_id = parties.id
		WHERE candidates.id = ?`	;
	const params = [req.params.id];

	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
		}
		res.json({
			message: "success",
			data: row,
		});
	});
});

// delete particular candidate
app.delete("/api/candidates/:id", (req, res) => {
	const sql = `DELETE FROM candidates WHERE id = ?`;
	const params = [req.params.id];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.statusMessage(400).json({ error: res.message });
		} else if (!result.affectedRows) {
			res.json({
				message: "Candidate not found",
			});
		} else {
			res.json({
				message: "deleted",
				changes: result.affectedRows,
				id: req.params.id,
			});
		}
	});
});

// create a candidate
app.post("/api/candidate", ({ body }, res) => {
	const errors = inputCheck(
		body,
		"first_name",
		"last_name",
		"industry_connected"
	);
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}
	const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
				VALUES (?,?,?)`;
	const params = [body.first_name, body.last_name, body.industry_connected];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: body,
		});
	});
});

// Default response for any other request (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => {
	console.log(`Server running on post ${PORT}`);
});

const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

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
// db.query(`SELECT * FROM candidates`, (err, rows) => {
// 	console.log(rows);
// });

// select particular candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
	if (err) {
		console.log(err);
	}
	console.log(row);
});

// delete particular candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(result);
// });

// create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
			VALUES (?,?,?,?)`;
const params = [1, "Ronald", "Firbank", 1];

db.query(sql, params, (err, result) => {
	if (err) {
		console.log(err);
	}
	console.log(result);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => {
	console.log(`Server running on post ${PORT}`);
});

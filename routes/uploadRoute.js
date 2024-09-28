const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");
const fs = require('fs');

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "Raghul@123",
  database: "uber", 
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("MySQL connected.");
});


const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/profileInfo/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT * FROM user_info WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve profile information' });
        }
        if (result.length > 0) {
            return res.status(200).json({ success: true, first_name: result[0].first_name, last_name: result[0].last_name, number: result[0].phone, email: result[0].email });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    })
})

router.get('/profile/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT profile_pic FROM user_info WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve profile picture' });
        }
        if (result.length > 0) {
            return res.status(200).json({ success: true, profilePic: result[0].profile_pic });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    });
});

router.post("/updateProfileName", (req, res) => {
    const userId = req.body.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const query = "UPDATE user_info SET first_name = ?, last_name = ? WHERE id = ?";
    db.query(query, [firstName, lastName, userId], (err, result) => {
        if (err) {
            console.error("Error saving first name and last name to database:", err);
            return res.status(500).json({ success: false, message: "Failed to update name" });
          }
          return res.json({ success: true, message: "profile name updated successfully" });
    });
});

router.post("/updateEmail", (req, res) => {
    const email = req.body.email;
    const userId = req.body.userId;

    const query = "UPDATE user_info SET email = ? WHERE id = ?";
    db.query(query, [email, userId], (err, result) => {
        if (err) {
            console.error("Error saving email to database:", err);
            return res.status(500).json({ success: false, message: "Failed to update email" });
          }
          return res.json({ success: true, message: "email updated successfully" });
    });
});

router.post("/updatePhone", (req, res) => {
    const phone = req.body.phone;
    const userId = req.body.userId;

    const query = "UPDATE user_info SET phone = ? WHERE id = ?";
    db.query(query, [phone, userId], (err, result) => {
        if (err) {
            console.error("Error saving phone number to database:", err);
            return res.status(500).json({ success: false, message: "Failed to update phone number" });
          }
          return res.json({ success: true, message: "phone number updated successfully" });
    });
})

router.post("/upload", upload.single("profilePic"), (req, res) => {
  const userId = req.body.userId; 
  const filePath = `/uploads/${req.file.filename}`;

  const query = "UPDATE user_info SET profile_pic = ? WHERE id = ?";
  db.query(query, [filePath, userId], (err, result) => {
    if (err) {
      console.error("Error saving image path to database:", err);
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }
    return res.json({ success: true, message: "Image uploaded successfully" });
  });
});

router.delete('/deleteProfilePic/:userId', (req, res) => {
    const userId = req.params.userId;

    db.query('SELECT profile_pic FROM user_info WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error fetching profile picture' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let profilePicPath = results[0].profile_pic;

        if (profilePicPath.startsWith('/')) {
            profilePicPath = profilePicPath.substring(1);
        }
        
        fs.unlink(profilePicPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ success: false, message: 'Error deleting profile picture' });
            }

            db.query('UPDATE user_info SET profile_pic = NULL WHERE id = ?', [userId], (err) => {
                if (err) {
                    console.error('Error updating database:', err);
                    return res.status(500).json({ success: false, message: 'Error updating profile picture in database' });
                }

                return res.status(200).json({ success: true, message: 'Profile picture deleted successfully' });
            });
        });
    });
});


module.exports = router;

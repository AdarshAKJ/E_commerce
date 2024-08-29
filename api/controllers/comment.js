import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
    try {
        if (!req.query.postId) return res.status(500).json("Post id is required")
        const q = `select c.*, u.id AS userId , name, profilePic
                    FROM comments AS c
                    JOIN users AS u 
                    ON (u.id = c.userId)
                    WHERE(c.postId=?)
                    ORDER BY c.createdAt DESC
                `;

        db.query(q, [req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    }
    catch (err) {
        console.log(err);
    }
};

export const addComment = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        jwt.verify(token, "secretkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");

            // Query to check if the postId exists
            const checkPostQuery = "SELECT * FROM posts WHERE id = ?";
            db.query(checkPostQuery, [req.body.postId], (err, postData) => {
                if (err) return res.status(500).json(err);
                if (postData.length === 0)
                    return res.status(404).json("Post not found!");

                const q = "INSERT INTO comments(`userId`,`desc`,`createdAt`,`postId`) VALUES (?)";
                const values = [
                    userInfo.id,
                    req.body.desc,
                    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    req.body.postId,
                ];

                db.query(q, [values], (err, data) => {
                    if (err) return res.status(500).json(err);
                    return res.status(200).json("Comment has been created");
                });
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json("Server error");
    }
};


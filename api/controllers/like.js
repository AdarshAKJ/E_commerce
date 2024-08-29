import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLikes = (req, res) => {
    try {
        const q = `SELECT userId from likes WHERE postId = ?`;

        db.query(q, [req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data.map(like => like.userId));
        });
    }
    catch (err) {
        console.log(err);
    }
};

export const addLike = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");


        jwt.verify(token, "secretkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");

            // Query to check if the postId exists
            const q = "INSERT INTO likes(`userId`,`postId`) VALUES (?)";
            const values = [
                userInfo.id,
                req.body.postId,
            ];

            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Post has been liked");
            });
        });
    }
    catch (err) {
        console.log(err);
    }
};

export const deleteLike = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");


        jwt.verify(token, "secretkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");

            // Query to check if the postId exists
            const q = "DELETE FROM likes WHERE `userId`=? AND `postId`=?";

            db.query(q, [userInfo.id, req.query.postId], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Post has been disliked.");
            });
        });
    }
    catch (err) {
        console.log(err);
    }
};
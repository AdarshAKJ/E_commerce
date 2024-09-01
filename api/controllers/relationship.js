import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRelationship = (req, res) => {
    try {
        const q = `SELECT followerUserId from relationships WHERE followedUserId = ?`;

        db.query(q, [req.query.followerUserId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res
                .status(200)
                .json(data.map(relationship => relationship.followerUserId));
        });
    }
    catch (err) {
        console.log(err);
    }
};

export const addRelationship = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");


        jwt.verify(token, "secretkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");
            console.log("user ID = " + userInfo.id);

            // Query to check if the postId exists

            const q = "INSERT INTO relationships(`followerUserId`,`followedUserId`) VALUES (?)";
            const values = [
                userInfo.id,
                req.body.userId,
            ];

            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("following");
            });
        });
    }
    catch (err) {
        console.log(err);
    }
};

export const deletRelationship = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        jwt.verify(token, "secretkey", (err, userInfo) => {
            console.log("user ID = " + userInfo.id);
            if (err) return res.status(403).json("Token is not valid!");

            // Query to check if the postId exists
            const q = "DELETE FROM relationships WHERE `followerUserId`=? AND `followedUserId`=?";

            db.query(q, [userInfo.id, req.query.userId], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Unfollow");
            });
        });
    }
    catch (err) {
        console.log(err);
    }
};
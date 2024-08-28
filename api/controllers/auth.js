import { db } from "../connect.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
    // check user if exist;
    const q = "select * from users where userName = ?";

    db.query(q, [req.body.userName], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length) return res.status(409).json("User aleardy exists!");

        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "insert into users(`userName`, `email`, `password`, `name`) value(?)"

        const values = [req.body.userName, req.body.email, hashedPassword, req.body.name];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });



    });


}
export const login = (req, res) => {
    const q = "select * from users where userName = ?";

    if (!(req.body?.userName)) return res.status(500).json(err);


    db.query(q, [req.body.userName], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) return res.status(404).json("User not found");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json("Wrong password or username!");

        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(others);


    });
}

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been log out");
};

export const list = (req, res) => {
    const q = "select * from users";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        // console.log(data);

        if (data.length === 0) return res.status(409).json("No Users are There!");

        const { password, ...others } = data[0];

        return res.status(200).json(others);
    });
}
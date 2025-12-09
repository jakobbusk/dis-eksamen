const pool = require('../database/db').pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

class pinController {

    //opret pinkode i database, tager eventId og pinCode som parametre
    static async createPin(email, eventId, pinCode) {
        const query = 'INSERT INTO events (event_id, pincode, email) VALUES ($1, $2, $3) RETURNING *';
        //hash pinkode med bcrypt
        const salt = await bcrypt.genSalt(10);
        const pinCodeHashed = await bcrypt.hash(pinCode, salt);

        const values = [eventId, pinCodeHashed, email];
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error('Error creating pin:', err);
            throw err;
        }
    }

    //valider pinkode, tager eventId, email og pinCode som parametre
    static async validatePin(pinData) {
        const { eventId, pinCode, email } = pinData;
        const query = 'SELECT pincode FROM events WHERE event_id = $1 AND email = $2';
        const values = [eventId, email];
        try {
            const res = await pool.query(query, values);
            if (res.rows.length === 0) {
                return false; // ingen pin fundet for eventId
            }
            //tjek alle resultater for match (hvis flere pincode er oprettet for samme email og eventId)
            for (let i = 0; i < res.rows.length; i++) {
                const pinCodeHashed = res.rows[i].pincode;
                const isMatch = await bcrypt.compare(pinCode, pinCodeHashed);
                if (isMatch) {return true};
            }
            return false; // ingen matchende pin
        } catch (err) {
            console.error('Error validating pin:', err);
            throw err;
        }
    }

    //login med pin, HTTP request med eventId og pinCode i body
    static async login(req, res) {
        const { eventId, pinCode, email } = req.body;
        console.log('Login attempt for eventId:', eventId, 'email:', email);

        try {
            //tjek om credentials matcher
            const isValid = await pinController.validatePin({ eventId, pinCode, email });
            if (isValid) {
                //gem jsonwebtoken i cookie
                const token = jwt.sign({ eventId }, jwtSecret, { expiresIn: '15m' });
                res.cookie('token', token, { httpOnly: true, secure: true });
                res.status(200).json({ message: 'Pin validated successfully' });
            } else {
                res.status(401).json({ message: 'Invalid pin' });
            }
        } catch (err) {
            console.error('Error during pin login:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    //middleware til at tjekke login status via jwt i cookie
    static authenticatePin(req, res, next) {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not logged in, authorization denied' });
        }
        try {
            const decoded = jwt.verify(token, jwtSecret);
            if (decoded.eventId !== req.params.eventid) {
                return res.status(401).json({ message: 'Login not valid for this event' });
            }
            next();
        } catch (err) {
            res.status(401).json({ message: 'Login not valid' });
        }
    }

}

module.exports = pinController;
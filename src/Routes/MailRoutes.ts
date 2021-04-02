import express from "express"
import nodemailer from 'nodemailer'
import mailValidaion from "../Validation/MailValidation";
import dotenv from 'dotenv'

class MailRoute {
    public router: express.Router

    constructor() {
        this.router = express.Router();
        this.configureRoutes();
    }
    
    private configureRoutes() {
        this.router.post('/sendMail', this.sendMail)
    }

    private sendMail(req: express.Request, res: express.Response) {
        const validationResult = mailValidaion(req.body);
        console.log(!!validationResult.error)
        if (!!validationResult.error) {
			return res.status(400).json({
				message: validationResult.error.details[0].message,
			});
        }
        console.log(process.env.EMAIL)
        const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASSWORD,
			},
        });
        const { name, recieverEmail, message } = req.body;
        const mailOptions = {
            from: recieverEmail,
            to: "tudor.esan@icloud.com",
            subject: `New Message from ${name}!`,
            text: message,
        };
        let err;
        transporter.sendMail(mailOptions, (er, info) => {
            err = er;
        })
        console.log(err)
        // if (err) {
        //     return res.status(400).json({ message: err });
        // }
        return res.status(200).json({ message: "Mail sent!" });
        
    }
}

export default new MailRoute().router;
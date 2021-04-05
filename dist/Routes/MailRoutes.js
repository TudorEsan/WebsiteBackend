"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const MailValidation_1 = __importDefault(require("../Validation/MailValidation"));
class MailRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post('/sendMail', this.sendMail);
    }
    sendMail(req, res) {
        const validationResult = MailValidation_1.default(req.body);
        console.log(!!validationResult.error);
        if (!!validationResult.error) {
            return res.status(400).json({
                message: validationResult.error.details[0].message,
            });
        }
        console.log(process.env.EMAIL);
        const transporter = nodemailer_1.default.createTransport({
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
        });
        console.log(err);
        // if (err) {
        //     return res.status(400).json({ message: err });
        // }
        return res.status(200).json({ message: "Mail sent!" });
    }
}
exports.default = new MailRoute().router;
//# sourceMappingURL=MailRoutes.js.map
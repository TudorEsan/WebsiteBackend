"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const mailValidaion = (mail) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        recieverEmail: joi_1.default.string().email().required(),
        message: joi_1.default.string().required(),
    });
    return schema.validate(mail);
};
exports.default = mailValidaion;
//# sourceMappingURL=MailValidation.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const MailRoutes_1 = __importDefault(require("./Routes/MailRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const CryptoRoutes_1 = __importDefault(require("./Routes/CryptoRoutes"));
const authVerification_1 = require("./Middlewares/authVerification");
const AuthRoutes_1 = __importDefault(require("./Routes/AuthRoutes"));
dotenv_1.default.config();
class App {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.conectToDb();
        this.routes();
    }
    conectToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(process.env.DB_CONNECTION, {
                useNewUrlParser: true,
                poolSize: 10,
                useUnifiedTopology: true,
            }, (err) => {
                if (err)
                    console.log(err);
            });
        });
    }
    config() {
        this.app.use(cors_1.default({
            exposedHeaders: ["Authorization"],
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        //this.app.use('/', verifyAuth);
    }
    routes() {
        this.app.use("/mail", MailRoutes_1.default);
        this.app.use("/crypto", CryptoRoutes_1.default);
        this.app.use("/auth", AuthRoutes_1.default);
        this.app.get('', authVerification_1.verifyAuth, (req, res) => {
            res.send('Oosjdfojsfoij');
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map
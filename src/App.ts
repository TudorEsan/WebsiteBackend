import express from 'express'
import cors from 'cors'
import MailRoutes from './Routes/MailRoutes'

class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public app: express.Application;

    private config() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes() {
        this.app.use('/mail', MailRoutes);
    }
}

export default new App().app;
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Routes } from './routes/crmRoutes'
import * as mongoose from 'mongoose'

class App {
    public app: express.Application;
    public routesPrv: Routes = new Routes();
    public mongoURL: string = 'mongodb://localhost:27017/CRMdb'

    constructor() {
        this.app = express()
        this.config()
        this.routesPrv.routes(this.app)
        this.mongoSetup();
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    
    private mongoSetup(): void {
        // The code here isn't necessary now due to: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/10743
        // But may need to change otherwise
        // mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoURL, { useNewUrlParser: true }); 
    }
}

export default new App().app
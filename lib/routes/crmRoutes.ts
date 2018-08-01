import { PollRoutes } from "./PollRoutes";
import * as express from 'express'

export interface Router {
    routes(app: express.Application): void;
}

export class RouteManager {
    // Might be bad... hmmmm
    public routers: Router[] = [];

    constructor() {
        this.routers.push(new PollRoutes());
    }

    // public pollController: PollController = new PollController();
    // public personController: PersonController = new PersonController();

    public routes(app: express.Application): void {
        this.routers.forEach(router => {
            router.routes(app);
        });
    }
}
import { PollRoutes } from "./PollRoutes";
import { Router } from "./Router";
import * as express from 'express'

export class RouteManager {
    // Might be bad... hmmmm
    public routers: Router[] = [];

    // Routers being used
    // Poll Router
    constructor() {
        this.routers.push(new PollRoutes());
    }

    public routes(app: express.Application): void {
        this.routers.forEach(router => {
            router.routes(app);
        });
    }
}
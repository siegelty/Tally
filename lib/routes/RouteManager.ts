import { PollRoutes } from "./PollRoutes";
import { Routes } from "./Routes";
import * as express from 'express'
import { PersonRoutes } from "./PersonRoutes";

export class RouteManager {
    // Might be bad... hmmmm
    public routers: Routes[] = [];

    // Routers being used
    // Poll Router
    // Person Router
    constructor() {
        this.routers.push(new PollRoutes());
        this.routers.push(new PersonRoutes());
    }

    public routes(app: express.Application): void {
        this.routers.forEach(router => {
            router.routes(app);
        });
    }
}
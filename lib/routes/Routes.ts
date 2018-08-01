import { Application } from "express";

// TODO: Rename me
export interface Routes {
    routes(app: Application): void;
}
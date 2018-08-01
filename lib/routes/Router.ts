import { Application } from "express";

export interface Router {
    routes(app: Application): void;
}
import { Routes } from "./Routes";
import { Application } from "express";
import { PersonController } from "../controllers/PersonController";

export class PersonRoutes implements Routes {
    public personController: PersonController = new PersonController();

    public routes(app: Application): void {

        // Get all people
        app.route('/people')
        .get(this.personController.getPeople)

        // Add new user
        app.route('/person/new')
        .post(this.personController.addNewPerson)
    }
}
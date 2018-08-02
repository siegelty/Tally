import { Request, Response, Application } from "express";
import { Routes } from "./Routes";

import { PollController } from "../controllers/PollController";

export class PollRoutes implements Routes {
    public pollController: PollController = new PollController();

    public routes(app: Application): void {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })

        // Create Poll
        app.route('/polls')
        .get(this.pollController.getPolls)

        app.route('/polls/new')
        .post(this.pollController.addNewPoll)

        app.route('/poll/vote')
        .post(this.pollController.pollIsOpen, this.pollController.validPerson, this.pollController.vote)

        app.route('/poll')
        .get(this.pollController.getPollStatus)
    }
}
import {Request, Response} from 'express'
import { PollController } from '../controllers/crmController'

export class Routes {

    public pollController: PollController = new PollController();

    public routes(app): void {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })

        // Create Poll
        app.route('/poll')
        .get(this.pollController.getPolls)
        .post(this.pollController.addNewPoll)
    }

}
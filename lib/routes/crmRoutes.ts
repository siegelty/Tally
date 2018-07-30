import {Request, Response} from 'express'
import { PollController } from '../controllers/PollController'
import { PersonController } from '../controllers/PersonController'

export class Routes {

    public pollController: PollController = new PollController();
    public personController: PersonController = new PersonController();

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

        // Add new user
        app.route('/person/new')
        .post(this.personController.addNewPerson)
    }

}
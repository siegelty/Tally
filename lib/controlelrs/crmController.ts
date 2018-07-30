import * as mongoose from 'mongoose';
import { PollSchema } from '../model/crmModel';
import { Request, Response } from 'express';

const Poll = mongoose.model('Poll', PollSchema);

export class PollController {

    public addNewPoll ( req: Request, res: Response ) {
        let newPoll = new Poll(req.body);

        newPoll.save((err, poll) => {
            if(err) {
                res.send(err);
            }

            res.json(poll);
        })
    }

    public getPolls(req: Request, res: Response) {
        Poll.find({}, (err, poll) => {
            if (err) {
                res.send(err);
            }

            res.json(poll);
        })
    }
}
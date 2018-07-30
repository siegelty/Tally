import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { PersonSchema } from '../models/personModel';
import { PollSchema } from '../models/pollModel';

const Poll = mongoose.model('Poll', PollSchema);
const Person = mongoose.model('Person', PersonSchema);

export class PollController {

    public addNewPoll(req: Request, res: Response) {
        Person.find({}, (err, people) => {
            if (err) {
                res.send(err)
            }

            let full_doc = req.body;
            full_doc.undecided = people.map(person => {return person._id});

            let newPoll = new Poll(full_doc);

            newPoll.save((err, poll) => {
                if (err) {
                    res.send(err);
                }
                res.json(poll);
            })
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
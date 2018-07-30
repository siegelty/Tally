import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { PersonSchema } from '../models/personModel';

const Person = mongoose.model('Person', PersonSchema);

export class PersonController {

    public addNewPerson(req: Request, res: Response) {
        let newPerson = new Person(req.body);

        newPerson.save((err, person) => {
            if (err) {
                res.send(err);
            }

            res.json(person);
        })
    }
}
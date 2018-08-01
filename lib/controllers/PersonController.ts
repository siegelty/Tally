import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { PersonSchema } from '../models/PersonModel';

const Person = mongoose.model('Person', PersonSchema);

export class PersonController {

    public getPeople(req: Request, res: Response) {
        Person.find({}, (err, people) => {
            if (err) {
                res.send(err);
            }

            res.json(people);
        })
    }

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
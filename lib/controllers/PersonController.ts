import { Request, Response } from 'express';
import * as mongoose from 'mongoose';

import { PersonSchema } from '../models/PersonModel';
import { getPeople } from '../operators/PersonOperators';

const Person = mongoose.model('Person', PersonSchema);

export class PersonController {

    public getPeople(req: Request, res: Response) {
        getPeople()
        .then((people) => {
            res.json({people: people});
            return;
        })
        .catch((err) =>{
            res.send(err)
        })
    }

    public addNewPerson(req: Request, res: Response) {
        let newPerson = new Person(req.body);

        newPerson.save((err, person) => {
            if (err) {
                res.status(400).send(err); 
                return; 
            }

            res.json({person: person});
        })
    }
}
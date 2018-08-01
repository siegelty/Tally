// These are meant to be functionalities used throghout the app
import * as mongoose from 'mongoose'
import { PersonSchema } from '../models/PersonModel';

const Person = mongoose.model('Person', PersonSchema);


// Promise that will resolve returning an array of people
export function getPeople(): Promise<any> {
    return new Promise((resolve, reject) => {
        Person.find({}, (err, people) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(people);
        })
    })
}
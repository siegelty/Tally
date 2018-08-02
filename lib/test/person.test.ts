import * as expect from 'expect';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { ObjectId } from "mongodb";
// import * as log from 'why-is-node-running'

import app from "../App";

import { PersonSchema } from "../models/PersonModel";

const Person = mongoose.model('Person', PersonSchema);

const people = [{
    _id: new ObjectId(),
    name: "Sam Darnold"
}, {
    _id: new ObjectId(),
    name: "Teddy Brdigewater"
}]

beforeEach((done) => {
    Person.remove({}).then((() => {
        return Person.insertMany(people);
    })).then(() => done());
})

describe('POST /person/new', () => {
    it('Should create a new person, Shea Patterson', (done) => {
        const sheaDaddy = "Shea Patterson" 

        request(app)
            .post ('/person/new')
            .send({name: sheaDaddy})
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(sheaDaddy)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Person.find({name: sheaDaddy}).then((person) => {
                    expect(person.length).toBe(1)
                    expect(person[0]['name']).toBe(sheaDaddy)
                    done()
                }).catch((err) => done(err))
            })
    })
})

describe('GET /people', () => {
    it('Should get all the people', (done) => {
        request(app)
            .get('/people')
            .expect(200)
            .expect((res) => {
                expect(res.body.people.length).toBe(2)
            })
            .end(done)
    })
})

// setTimeout(function () {
//     log() // logs out active handles that are keeping node running
//   }, 1000)
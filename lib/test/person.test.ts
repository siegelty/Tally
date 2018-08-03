import * as expect from 'expect';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
// import * as log from 'why-is-node-running'

import app from "../App";

import { PersonSchema } from "../models/PersonModel";
import { people } from './person_mock';

const Person = mongoose.model('Person', PersonSchema);

beforeEach((done) => {
    Person.remove({}).then(() => {
        return Person.insertMany(people);
    }).then(() => done());
})

describe('POST /person/new', () => {
    it('Should create a new person, Shea Patterson', (done) => {
        const sheaDaddy = "Shea Patterson" 

        request(app)
            .post ('/person/new')
            .send({name: sheaDaddy})
            .expect(200)
            .expect((res) => {
                expect(res.body.person.name).toBe(sheaDaddy)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Person.findOne({name: sheaDaddy}).then((person) => {
                    // expect(person.length).toBe(1)
                    expect(person['name']).toBe(sheaDaddy)
                    done()
                }).catch((err) => done(err))
            })
    })

    it('Should fail to create a new person as no name was given', (done) => {
        request(app)
            .post('/person/new')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Person.find({}).then((db_people) => {
                    expect(db_people.length).toBe(2)
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
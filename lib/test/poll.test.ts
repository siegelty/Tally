import * as expect from 'expect';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { ObjectId } from "mongodb";

import app from "../App"
import { PollSchema } from '../models/PollModel';
import { PersonSchema } from '../models/PersonModel';
import { people } from './person_mock';
import { open_poll_id, closed_poll_id, closed_poll, halfway_poll_id, halfway_poll, polls } from './poll_mock';
import { poll_statuses } from '../types/poll_statuses';


const Poll = mongoose.model('Poll', PollSchema);
const Person = mongoose.model('Person', PersonSchema);

beforeEach((done) => {
    Poll.remove({}).then(() => {
        return Poll.insertMany(polls)
    }).then(() => {
        return Person.remove({})
    }).then(() => {
        return Person.insertMany(people)
    }).then(() => done());
}) 

describe('GET /polls', () => {
    it('Should get all the polls and return them', (done) => {
        request(app)
            .get('/polls')
            .expect(200)
            .expect((res) => {
                expect(res.body.polls.length).toBe(polls.length)
            })
            .end(done)
    })
})

describe('GET /poll', () => {
    it('Should get an open poll see two undecided', (done) => {
        request(app)
            .get('/poll?poll=' + open_poll_id)
            .expect(200)
            .expect((res) => {
                expect(res.body.poll.status).toBe(poll_statuses.OPEN)
                expect(res.body.poll.undecided.length).toBe(people.length)
                expect(res.body.poll.results).toBeUndefined()

                // Check that undecided is correct
                expect(res.body.poll.undecided.map(person => person.name))
                    .toEqual(people.map(person => person.name))
            })
            .end(done)
    })

    it('Should get a closed poll and see two results', (done) => {
        request(app)
            .get('/poll?poll=' + closed_poll_id)
            .expect(200)
            .expect((res) => {
                // Check basic results
                expect(res.body.poll.status).toBe(poll_statuses.CLOSED)
                expect(res.body.poll.undecided).toBeUndefined()
                expect(res.body.poll.results.length).toBe(closed_poll.options.length)

                // Check that results are obscured properly
                closed_poll.options.forEach((option, index) => {
                    expect(res.body.poll.results[index].supporters).toBe(option.supporters.length)
                })

            })
            .end(done)
    })

    it('Should get a open poll and see the one person who hasn\'t voted', (done) => {
        request(app)
            .get('/poll?poll=' + halfway_poll_id)
            .expect(200)
            .expect((res) => {
                // Check basic status
                expect(res.body.poll.status).toBe(poll_statuses.OPEN)
                expect(res.body.poll.undecided.length).toBe(halfway_poll.undecided.length)
                expect(res.body.poll.results).toBeUndefined()
                
                // Check the correct person is named
                expect(res.body.poll.undecided.map(person => person.name))
                    .toEqual(people.filter(person => {
                        // Filter the people who should be in undecided
                        return halfway_poll.undecided.indexOf(person._id) > -1;
                    }).map(person => person.name))
            })
            .end(done)
    })

    it('Should receive an error for a poll not found', (done) => {
        const wrongPoll = new ObjectId()
        request(app)
            .get('/poll?poll=' + wrongPoll)
            .expect(400)
            .end(done)
    })
})

describe('POST /polls/new', () => {
    it("Should create a new poll and see the people added", (done) => {
        const new_poll = {
            prompt: "Who will win the natty",
            options: [
                {prompt: "Michigan"},
                {prompt: "UofM"},
                {prompt: "Bama"}
            ]
        }

        request(app)
            .post('/polls/new')
            .send(new_poll)
            .expect(200)
            .expect((res) => {
                expect(res.body.poll.options.length).toBe(new_poll.options.length)
                expect(res.body.poll.undecided.length).toBe(people.length)
                expect(res.body.poll.prompt).toBe(new_poll.prompt)
                expect(res.body.poll._id).toBeDefined();
            })
            .end((err, res) =>  {
                if (err) {
                    return done(err);
                }

                Poll.findOne({_id: res.body.poll._id}).then((db_poll) => {
                    expect(db_poll['options'].length).toBe(new_poll.options.length)
                    expect(db_poll['undecided'].length).toBe(people.length)
                    expect(db_poll['prompt']).toBe(new_poll.prompt)
                    done()
                }).catch(err => done(err))
            })
    })
})

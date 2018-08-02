import * as expect from 'expect';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { ObjectId } from "mongodb";

import app from "../App"
import { PollSchema } from '../models/PollModel';
import { PersonSchema } from '../models/PersonModel';

import { polls, open_poll_id, open_poll, halfway_poll_id, halfway_poll, closed_poll_id } from './poll_mock';
import { people } from './person_mock';
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

describe('POST /polls/vote', () => {
    it('Should register a vote for person 0 on option 0', (done) => {
        const vote_package = {
            person: people[0]._id,
            option: open_poll.options[0]._id
        }
        
        request(app)
            .post('/poll/vote?poll=' + open_poll_id)
            .send(vote_package)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe("Vote Registered")
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Poll.findOne({_id: open_poll_id}).then((db_poll) => {
                    expect(db_poll['status']).toBe(poll_statuses.OPEN)

                    // Comes from fresh poll and therefore should have one less undecided person
                    expect(db_poll['undecided'].length).toBe(people.length - 1);
                    expect(db_poll['options'][0]['supporters'].length).toBe(1);

                    done();
                }).catch(err => done(err));
            })
    })

    it('Should register the final vote of two people', (done) => {
        // Assumes person 1 already voted 

        const vote_package = {
            person: people[0]._id,
            option: halfway_poll.options[0]._id
        }
        
        request(app)
            .post('/poll/vote?poll=' + halfway_poll_id)
            .send(vote_package)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe("Vote Registered")
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Poll.findOne({_id: halfway_poll_id}).then((db_poll) => {
                    expect(db_poll['status']).toBe(poll_statuses.CLOSED)

                    // Comes from fresh poll and therefore should have one less undecided person
                    expect(db_poll['undecided'].length).toBe(0);
                    expect(db_poll['options'][0]['supporters'].length).toBe(2);

                    done();
                }).catch(err => done(err));
            })
    })

    it('Should change the vote from decided to undecided', (done) => {
        const vote_package = {
            person: people[1]._id,
            // Lack of option here means changing to undecided
        }
        
        request(app)
            .post('/poll/vote?poll=' + halfway_poll_id)
            .send(vote_package)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe("Vote Registered")
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Poll.findOne({_id: halfway_poll_id}).then((db_poll) => {
                    expect(db_poll['status']).toBe(poll_statuses.OPEN)

                    // Comes from fresh poll and therefore should have one less undecided person
                    expect(db_poll['undecided'].length).toBe(people.length);
                    expect(db_poll['options'][0]['supporters'].length).toBe(0);

                    done();
                }).catch(err => done(err));
            })
    })

    it('Should change the vote from one decision to another', (done) => {
        const vote_package = {
            person: people[1]._id,
            option: halfway_poll.options[1]._id
        }
        
        request(app)
            .post('/poll/vote?poll=' + halfway_poll_id)
            .send(vote_package)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe("Vote Registered")
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Poll.findOne({_id: halfway_poll_id}).then((db_poll) => {
                    expect(db_poll['status']).toBe(poll_statuses.OPEN)

                    // Comes from fresh poll and therefore should have one less undecided person
                    expect(db_poll['undecided'].length).toBe(1);
                    expect(db_poll['options'][0]['supporters'].length).toBe(0);
                    expect(db_poll['options'][1]['supporters'].length).toBe(1);

                    done();
                }).catch(err => done(err));
            })
    })

    it('Should fail to vote on a closed poll', (done) => {
        const vote_package = {
            person: people[1]._id,
        }
        
        request(app)
            .post('/poll/vote?poll=' + closed_poll_id)
            .send(vote_package)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe("Poll is closed")
            })
            .end(done)
    })

    it('Should make a malformed vote attempt with wrong poll', (done) => {
        const vote_package = {
            person: people[1]._id,
        }
        
        request(app)
            .post('/poll/vote?poll=' + new ObjectId())
            .send(vote_package)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe("Poll cannot be found")
            })
            .end(done)
    })

    it('Should make a malformed vote with a wrong person', (done) => {
        const vote_package = {
            person: new ObjectId(),
            option: open_poll.options[0]._id
        }
        
        request(app)
            .post('/poll/vote?poll=' + open_poll_id)
            .send(vote_package)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe("Invalid person")
            })
            .end(done)
    })

    it('Should fail as it doesn\'t include a poll', (done) => {
        const vote_package = {
            person: new ObjectId(),
            option: open_poll.options[0]._id
        }
        
        request(app)
            .post('/poll/vote')
            .send(vote_package)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe("No Poll Specified")
            })
            .end(done)
    })
})

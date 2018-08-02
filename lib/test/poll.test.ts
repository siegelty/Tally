import * as expect from 'expect';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { ObjectId } from "mongodb";

import app from "../App"

import { PollSchema } from "../models/PollModel";
import { PersonSchema } from '../models/PersonModel';

const Poll = mongoose.model('Poll', PollSchema);
const Person = mongoose.model('Person', PersonSchema);

const people = [{
    _id: new ObjectId(),
    name: "Sam Darnold"
}, {
    _id: new ObjectId(),
    name: "Teddy Bridgewater"
}]

const open_poll_id = new ObjectId();
const closed_poll_id = new ObjectId();
const halfway_poll_id = new ObjectId();

const open_poll = {
    _id: open_poll_id,
    undecided: people.map(person => person._id),
    status: "OPEN",
    prompt: "Who is gonna be GOAT?",
    options: [{
        _id: new ObjectId(),
        prompt: "Tom Brady",
        supporters: []
    },{
        _id: new ObjectId(),
        prompt: "Sam Darnold",
        supporters: []
    },{
        _id: new ObjectId(),
        prompt: "Shea Patterson",
        supporters: []
    }]
}

const closed_poll = {
    _id: closed_poll_id,
    undecided: [],
    status: "CLOSED",
    prompt: "Who is gonna be GOAT?",
    options: [{
        _id: new ObjectId(),
        prompt: "Tom Brady",
        supporters: [people[0]._id]
    },{
        _id: new ObjectId(),
        prompt: "Sam Darnold",
        supporters: [people[1]._id]
    },{
        _id: new ObjectId(),
        prompt: "Shea Patterson",
        supporters: []
    }]
}

const halfway_poll = {
    _id: halfway_poll_id,
    undecided: [people[0]._id],
    status: "OPEN",
    prompt: "Who is gonna be GOAT?",
    options: [{
        _id: new ObjectId(),
        prompt: "Tom Brady",
        supporters: [people[1]._id]
    },{
        _id: new ObjectId(),
        prompt: "Sam Darnold",
        supporters: []
    },{
        _id: new ObjectId(),
        prompt: "Shea Patterson",
        supporters: []
    }]
}

const polls = [open_poll, closed_poll, halfway_poll]

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
                expect(res.body.poll.status).toBe('OPEN')
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
                expect(res.body.poll.status).toBe('CLOSED')
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
                expect(res.body.poll.status).toBe('OPEN')
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

})

describe('POST /polls/vote', () => {

})


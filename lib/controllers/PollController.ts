import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { PersonSchema } from '../models/personModel';
import { PollSchema } from '../models/pollModel';

const Poll = mongoose.model('Poll', PollSchema);
const Person = mongoose.model('Person', PersonSchema);

const ObjectId = mongoose.Types.ObjectId;
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

    public vote(req: Request, res: Response) {
        const body = req.body;

        if (!body.person || !body.poll) {
            res.status(400).send({
                message: "Must have a person who voted and a poll to vote on"
            })
            return;
        }

        // Remove from undecided
        removeFromUndecided(body)
        .then(function() {
            // Then remove the person from any options
            return removeFromOptions(body)
        })
        .then(function() {
            // Tally that person's vote
            return tallyVote(body);
        })
        .then(function() {
            res.json({message: "Update successful"})
        })
        .catch(function(err) {
            res.send(err);
        })
    }
}

function removeFromUndecided(body): Promise<any> {
    return new Promise(function(resolve, reject) {
        Poll.update(
            {_id: body.poll}, 
            { $pull: {'undecided': body.person} },
            (err, poll) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    })
}

function removeFromOptions(body): Promise<any> {

    return new Promise(function(resolve, reject) {
        var db = mongoose.connection;
        Poll.update(
            {
                _id: new ObjectId(body.poll),
                'options.supporters': new ObjectId(body.person)
            },
            { $pull: {'options.$.supporters': new ObjectId(body.person) } },
            (err, poll) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    })
}

function tallyVote(body): Promise<any> {
    if (body.option) {
        return tallyOption(body)
    } else {
        return tallyUndecided(body)
    }
}

function tallyOption(body): Promise<any> {
    return new Promise(function(resolve, reject) {
        var db = mongoose.connection;
        Poll.update(
            {
                _id: new ObjectId(body.poll),
                'options._id': new ObjectId(body.option)

            },
            {
                $push: {"options.$.supporters": new ObjectId(body.person)}
            },
            (err, poll) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    })
}

function tallyUndecided(body): Promise<any> {
    return new Promise(function(resolve, reject) {
        Poll.update(
            {
                _id: new ObjectId(body.poll),
            },
            {
                $push: {"undecided": new ObjectId(body.person)}
            },
            (err, poll) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    })
}
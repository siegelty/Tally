import { Request, Response } from 'express';
import * as mongoose from 'mongoose';

import { getPeople } from '../operators/PersonOperators';
import { getPolls, getPoll, preparePollWithResults, preparePollWithUnvoted } from '../operators/PollOperators';
import { removePersonFromUndecided, tallyPersonVote, removePersonFromOptions, updatePollState } from "../operators/VoteOperators";
import { PollSchema } from '../models/PollModel';
import { poll_statuses } from '../types/poll_statuses';

const Poll = mongoose.model('Poll', PollSchema);

export class PollController {

    public addNewPoll(req: Request, res: Response) {
        getPeople()
        .then((people) => {
            let full_doc = req.body;
            full_doc.undecided = people.map(person => {return person._id});

            let newPoll = new Poll(full_doc);

            return newPoll.save();
        })
        .then((poll) => {
            res.json({poll: poll});
        })
        .catch((err) => {
            res.send(err);
        })
    }

    // TODO: Change this to a utility promise and create a one for routes
    public getPolls(req: Request, res: Response) {
        getPolls()
        .then((polls) => {
            res.json({polls: polls});
        })
        .catch((err) => {
            res.status(400).send(err);
        })
    }

    public vote(req: Request, res: Response) {
        let body = {...req.body, ...{poll: req.query.poll}};

        if (!body.person || !body.poll) {
            res.status(400).send({
                message: "Must have a person who voted and a poll to vote on"
            })
            return;
        }

        // Remove from undecided
        removePersonFromUndecided(body)
        .then(function() {
            // Then remove the person from any options
            return removePersonFromOptions(body)
        })
        .then(function() {
            // Tally that person's vote
            return tallyPersonVote(body);
        })
        .then(function() {
            return updatePollState(body);
        })
        .then(function() {
            res.json({message: "Vote Registered"})
        })
        .catch(function(err) {
            res.send(err);
        })
    }

    public getPollStatus(req: Request, res: Response) {
        const body = {...req.body, ...{poll: req.query.poll}};
        // Get Poll
        getPoll(body.poll)
        // Figure out to 1) display results or 2) unvoted
        .then((poll) => {
            if (poll['status'] == poll_statuses.CLOSED) {
                // 1) Send back Poll with results (and status)
                return preparePollWithResults(poll);
            } else {
                return preparePollWithUnvoted(poll);
                // 2) Send back Poll unvoted people (and status)
                    // 2a) Retreive names of unvoted 
            }
        })
        .then((poll) => {
            res.json({poll: poll});
        })
        .catch((err) => {
            res.status(400).send(err);
        })
    }

    // Middle ware to check poll is open
    public pollIsOpen(req: Request, res: Response, next) {
        const body = {...req.body, ...{poll: req.query.poll}};

        if (!body.poll) {
            res.status(400).send({message: "No Poll Specified"});
            return;
        }

        getPoll(body.poll)
        .then(function(poll) {
            if (poll['status'] == poll_statuses.OPEN) {
                next();
            } else {
                res.status(400).send({message: "Poll is closed"})
                return;
            }
        })
        .catch(function(err) {
            res.status(400).send({message: "Poll cannot be found"});
        })
    }

    public validPerson(req: Request, res: Response, next) {
        const body = {...req.body, ...{poll: req.query.poll}};

        if (!body.person) {
            res.status(400).send({message: "No Person Specified"});
            return;
        }

        getPoll(body.poll)
        .then(function(poll) {
            let found = false
            if (poll['undecided'].indexOf(body.person) > -1) {
                found = true;
            }
            poll['options'].forEach(option => {
                if (option.supporters.indexOf(body.person) > -1) {
                    found = true;
                }
            });
            
            if (found) {
                next();
            } else {
                res.status(400).send({message: "Invalid person"});
            }
        })
        .catch(function (err) {
            res.status(400).send({message: "Invalid Person"});
        })
    }
}


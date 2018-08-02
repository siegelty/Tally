// These are tools intended to aide in the voting operations
import * as mongoose from 'mongoose';

import { getPoll } from './PollOperators';
import { PollSchema } from '../models/PollModel';
import { poll_statuses } from '../types/poll_statuses';

const Poll = mongoose.model('Poll', PollSchema);

const ObjectId = mongoose.Types.ObjectId;

export function removePersonFromUndecided(body): Promise<any> {
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

export function removePersonFromOptions(body): Promise<any> {

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

export function tallyPersonVote(body): Promise<any> {
    if (body.option) {
        return tallyPersonOption(body)
    } else {
        return tallyPersonUndecided(body)
    }
}

function tallyPersonOption(body): Promise<any> {
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

function tallyPersonUndecided(body): Promise<any> {
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

// Might move this to PollOperators, but couldn't decide, 
// this is only due to a vote so far... 
export function updatePollState(body): Promise<any> {
    return new Promise(function(resolve, reject) {
        getPoll(body.poll)
        .then((poll) => {
            if (!poll || poll == null) {
                reject("Poll not found!");
                return;
            }

            const status: String = poll["undecided"].length == 0 ? poll_statuses.CLOSED : poll_statuses.OPEN;

            Poll.update(
                {_id: new ObjectId(body.poll)},
                { 'status': status },
                (err, poll) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            )
        })
        .catch((err) => {
            reject(err);
            return;
        })
    })
}
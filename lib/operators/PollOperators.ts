// These are meant to be functionalities used throghout the app
import * as mongoose from 'mongoose'
import { PollSchema } from '../models/PollModel';
import { getPerson } from './PersonOperators';

const Poll = mongoose.model('Poll', PollSchema);
const ObjectId = mongoose.Types.ObjectId;

export function getPolls(): Promise<any> {
    return new Promise((resolve, reject) => {
        Poll.find({}, (err, polls) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(polls);
        })
    })
}

export function getPoll(poll: string) {
    return new Promise(function(resolve, reject) {
        Poll.findOne({_id: new ObjectId(poll)}, (err, poll) => {
            if (err || !poll) {
                reject(err);
                return;
            }

            resolve(poll);
        })
    })
}

export function preparePollWithResults(poll): Promise<any> {
    return new Promise(function(resolve, reject) {
        const results = poll.options.map(option => {
            return {
                _id: option._id,
                prompt: option.prompt,
                supporters: option.supporters.length
            }
        });
        const derived_poll = {
            status: poll.status,
            _id: poll._id,
            results: results
        }

        resolve(derived_poll)
    })
}

export function preparePollWithUnvoted(poll): Promise<any> {
    return new Promise(function(resolve, reject) {
        const undecidedPromises: Promise<any>[] = poll.undecided.map(person => {
            return getPerson(person);
        });
        
        // TODO: Resolve if this is still the best way
        Promise.all(undecidedPromises)
        .then((undecided) => {
            const derived_poll = {
                status: poll.status,
                _id: poll._id,
                undecided: undecided.map((person) => {
                    return {
                        _id: person._id,
                        name: person.name
                    }
                })
            }
    
            resolve(derived_poll)
        })
        .catch((err) => {
            reject(err)
        })
        
    })
}
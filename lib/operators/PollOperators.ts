// These are meant to be functionalities used throghout the app
import * as mongoose from 'mongoose'
import { PollSchema } from '../models/PollModel';

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
            if (err) {
                reject(err);
                return;
            }

            resolve(poll);
        })
    })
}
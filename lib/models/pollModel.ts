import * as mongoose from 'mongoose';
import { PersonSchema } from './personModel';
import { OptionSchema } from './optionModel';

const Schema = mongoose.Schema;

export const PollSchema = new Schema({
    prompt: {
        type: String,
        required: 'Enter a prompt for the poll'
    },
    options: [ OptionSchema ],
    undecided: [ PersonSchema ],
    created_date: {
        type: Date,
        default: Date.now
    }
})
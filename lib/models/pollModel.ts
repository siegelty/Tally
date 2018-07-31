import * as mongoose from 'mongoose';
import { OptionSchema } from './optionModel';

const Schema = mongoose.Schema;

export const PollSchema = new Schema({
    prompt: {
        type: String,
        required: 'Enter a prompt for the poll'
    },
    options: {
        type: [ OptionSchema ],
        required: 'Enter at least one option!',
        validate: {
            validator: function() {
                return this.options.length > 0
            },
            message: 'You must provide at least one option!'
        }
    },
    undecided: [ Schema.Types.ObjectId ],
    created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSE'],
        default: 'OPEN'
    }
})
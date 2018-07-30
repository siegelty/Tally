import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PollSchema = new Schema({
    prompt: {
        type: String,
        required: 'Enter a prompt for the poll'
    },
    options: [{
        option_text: String,
        supporters: [{ name: String }]
    }],
    undecided: [{ name: String }],
    created_date: {
        type: Date,
        default: Date.now
    }
})
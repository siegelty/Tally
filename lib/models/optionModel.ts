import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OptionSchema = new Schema({
    prompt: {
        type: String,
        requied: "All options must have prompts"
    },
    supporters: [ Schema.Types.ObjectId ]
})
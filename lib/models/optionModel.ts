import * as mongoose from 'mongoose';
import { PersonSchema } from './personModel';

const Schema = mongoose.Schema;

export const OptionSchema = new Schema({
    prompt: {
        type: String,
        requied: "All options must have prompts"
    },
    supporters: [ PersonSchema ]
})
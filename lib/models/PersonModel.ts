import * as mongoose from 'mongoose'

const Schema = mongoose.Schema;

export const PersonSchema = new Schema({
    name: {
        type: String,
        required: "You must have a name!!"
    }
})

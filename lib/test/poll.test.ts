import * as expect from 'expect';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { ObjectId } from "mongodb";

import app from "../App"

import { PollSchema } from "../models/PollModel";

const pollSchema = mongoose.model('Poll', PollSchema);

describe('test get', () => {
    it('tests that two files will run', (done) => {
        done();
    })
})
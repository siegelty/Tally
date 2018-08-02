import { ObjectId } from "mongodb";
import { people } from "./person_test_objects";

// TODO: Maybe change to classes?
export const open_poll_id = new ObjectId();
export const closed_poll_id = new ObjectId();
export const halfway_poll_id = new ObjectId();

export const open_poll = {
    _id: open_poll_id,
    undecided: people.map(person => person._id),
    status: "OPEN",
    prompt: "Who is gonna be GOAT?",
    options: [{
        _id: new ObjectId(),
        prompt: "Tom Brady",
        supporters: []
    },{
        _id: new ObjectId(),
        prompt: "Sam Darnold",
        supporters: []
    },{
        _id: new ObjectId(),
        prompt: "Shea Patterson",
        supporters: []
    }]
}

export const closed_poll = {
    _id: closed_poll_id,
    undecided: [],
    status: "CLOSED",
    prompt: "Who is gonna be GOAT?",
    options: [{
        _id: new ObjectId(),
        prompt: "Tom Brady",
        supporters: [people[0]._id]
    },{
        _id: new ObjectId(),
        prompt: "Sam Darnold",
        supporters: [people[1]._id]
    },{
        _id: new ObjectId(),
        prompt: "Shea Patterson",
        supporters: []
    }]
}

export const halfway_poll = {
    _id: halfway_poll_id,
    undecided: [people[0]._id],
    status: "OPEN",
    prompt: "Who is gonna be GOAT?",
    options: [{
        _id: new ObjectId(),
        prompt: "Tom Brady",
        supporters: [people[1]._id]
    },{
        _id: new ObjectId(),
        prompt: "Sam Darnold",
        supporters: []
    },{
        _id: new ObjectId(),
        prompt: "Shea Patterson",
        supporters: []
    }]
}

export const polls = [open_poll, closed_poll, halfway_poll]
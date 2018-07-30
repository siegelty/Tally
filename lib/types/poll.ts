// Type for votes
import { option } from "./option"
import { person } from "./person"

// May not need
export class poll {
    prompt: string;
    options: option[];
    undecided: person[];

    // Constructs the basic parts of a poll with no votes
    constructor(prompt: string, options: option[]) {
        this.prompt = prompt;
        this.options = Array.from(options);
    }

    vote(person_id: string, decision?: string, undecided?: boolean) {
        //test
    }
}

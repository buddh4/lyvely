import { isBoolean } from "class-validator";
import { IJournal } from './journal.interface';

export class JournalFilter {
    category: string;
    archived = false;

    run(journal: IJournal) {
        if(this.category && !journal.tagIds.includes(this.category)) {
            return false;
        }

        if(this.archived !== journal.archived) {
            return false
        }

        return true;
    }

    update(update: Partial<JournalFilter>) {
        if(typeof update.category !== 'undefined') {
            this.category = update.category;
        }

        if(isBoolean(update.archived)) {
            this.archived = update.archived;
        }
    }
}
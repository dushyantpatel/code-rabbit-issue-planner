// this could be a module to connect to a database.

import { IssueClass } from '../types/issue';

interface DataStore {
    issues: IssueClass[];
}

// for now, we will store data in memory
export const dataStore: DataStore = {
    issues: [],
};

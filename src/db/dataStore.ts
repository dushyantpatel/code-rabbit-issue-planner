// This could be a module to connect to a database.

import { IssueClass } from '../types/issue';

interface DataStore {
    issues: IssueClass[];
}

// For now, we will store data in memory
// Create a singleton instance of the data store
const dataStore: DataStore = {
    issues: [],
};

export { dataStore };

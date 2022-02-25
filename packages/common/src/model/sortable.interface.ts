export interface Sortable {
    sortOrder?: number;
}

export function sortBySortOrder(a: Sortable, b: Sortable) {
    if(a.sortOrder === b.sortOrder) {
        return 0;
    }

    if(typeof a.sortOrder === 'undefined') {
        return 1;
    }

    if(typeof b.sortOrder === 'undefined') {
        return -1;
    }

    return a.sortOrder - b.sortOrder;
}
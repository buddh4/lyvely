import { sortBySortOrder } from '@lyvely/common';
export function sortTasks(taks) {
    return taks.sort((a, b) => {
        const aDone = a.done;
        const bDone = b.done;
        if (aDone && !bDone)
            return 1;
        if (!aDone && bDone)
            return -1;
        if (aDone && bDone) {
            if (a.meta.updatedAt < b.meta.updatedAt)
                return 1;
            if (a.meta.updatedAt > b.meta.updatedAt)
                return -1;
            if (a.meta.updatedAt === b.meta.updatedAt)
                return 0;
        }
        return sortBySortOrder(a, b);
    });
}

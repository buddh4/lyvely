import { CalendarPlanStore } from '@lyvely/calendar-plan-interface';
import { isDefined } from 'class-validator';
import { mergePercentages } from '@lyvely/common';
export class MilestoneRelationsStore extends CalendarPlanStore {
    constructor(models, relations) {
        super(models);
        this.relationsByTid = new Map();
        if (relations === null || relations === void 0 ? void 0 : relations.length)
            this.setRelations(relations);
    }
    handleResponse(response) {
        super.handleResponse(response);
        this.setRelations(response.relations);
    }
    reset() {
        super.reset();
        this.relationsByTid = new Map();
    }
    setRelation(relation) {
        this._setRelation(relation, this.relationsByTid);
    }
    setRelations(relations) {
        if (!relations)
            return;
        const update = new Map([...this.relationsByTid]);
        relations.forEach((log) => {
            this._setRelation(log, update);
        });
        this.relationsByTid = update;
    }
    _setRelation(relation, relations) {
        var _a, _b;
        const mid = relation.mid;
        if (!mid)
            return;
        if (!relations.has(mid)) {
            relations.set(mid, new Map());
        }
        if (!relation.tid)
            return;
        if (!((_a = relations.get(mid)) === null || _a === void 0 ? void 0 : _a.get(relation.tid))) {
            relations.get(mid).set(relation.tid, []);
        }
        const tidStore = (_b = relations.get(mid)) === null || _b === void 0 ? void 0 : _b.get(relation.tid);
        if (!tidStore)
            return;
        const relationIndex = tidStore === null || tidStore === void 0 ? void 0 : tidStore.findIndex((r) => r.cid === relation.cid);
        if (tidStore && isDefined(relationIndex) && 'undefined' && relationIndex < 0) {
            tidStore.push(relation);
        }
        else {
            tidStore[relationIndex] = relation;
        }
    }
    calculateProgress(identity, timingId) {
        const progresses = this.getRelations(identity, timingId)
            .filter((relation) => isDefined(relation.progress))
            .map((relation) => relation.progress);
        return progresses.length ? mergePercentages(progresses) : undefined;
    }
    getRelations(identity, timingId) {
        var _a, _b;
        const relationsByTimingId = (((_a = this.relationsByTid.get(this.getId(identity))) === null || _a === void 0 ? void 0 : _a.get(timingId)) ||
            []);
        const relationsWithoutTimingId = (((_b = this.relationsByTid
            .get(this.getId(identity))) === null || _b === void 0 ? void 0 : _b.get(undefined)) || []);
        return [...relationsByTimingId, ...relationsWithoutTimingId].sort((a, b) => {
            if (a && !b)
                return 1;
            if (!a && b)
                return -1;
            if (a && b) {
                if (isDefined(a.progress) && !isDefined(b.progress))
                    return -1;
                if (!isDefined(a.progress) && isDefined(b.progress))
                    return 1;
                if (a.progress > b.progress)
                    return 1;
                if (a.progress < b.progress)
                    return -1;
            }
            return 0;
        });
    }
}

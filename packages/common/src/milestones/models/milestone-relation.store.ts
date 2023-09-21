import { CalendarPlanStore } from '@/calendar-plan/models/calendar-plan.store';
import { MilestoneModel } from './milestone.model';
import { MilestoneRelationModel } from './milestone-relation.model';
import { MilestoneSearchResponse } from './milestone-search.response';
import { isDefined } from 'class-validator';
import { mergePercentages } from '@/utils';

type MilestoneIdentity = MilestoneModel | string;
type MID = string;
type TID = string;

/**
 * This class is used to stores time series content and related data points.
 */
export class MilestoneRelationsStore extends CalendarPlanStore<
  MilestoneModel,
  MilestoneSearchResponse
> {
  protected relationsByTid: Map<MID, Map<TID, MilestoneRelationModel[]>> = new Map();

  constructor(models?: MilestoneModel[], relations?: MilestoneRelationModel[]) {
    super(models);
    if (relations?.length) this.setRelations(relations);
  }

  override handleResponse(response: MilestoneSearchResponse) {
    super.handleResponse(response);
    this.setRelations(response.relations);
  }

  reset() {
    super.reset();
    this.relationsByTid = new Map();
  }

  setRelation(relation: MilestoneRelationModel) {
    this._setRelation(relation, this.relationsByTid);
  }

  setRelations(relations?: MilestoneRelationModel[]) {
    if (!relations) return;

    const update = new Map([...this.relationsByTid]);

    relations.forEach((log) => {
      this._setRelation(log, update);
    });

    this.relationsByTid = update;
  }

  private _setRelation(
    relation: MilestoneRelationModel,
    relations: Map<MID, Map<TID, MilestoneRelationModel[]>>,
  ) {
    const mid = relation.mid;

    if (!mid) return;

    if (!relations.has(mid)) {
      relations.set(mid, new Map());
    }

    if (!relations.get(mid).get(relation.tid)) {
      relations.get(mid).set(relation.tid, []);
    }

    const tidStore = relations.get(mid).get(relation.tid);
    const relationIndex = tidStore.findIndex((r) => r.cid === relation.cid);
    if (relationIndex < 0) {
      tidStore.push(relation);
    } else {
      tidStore[relationIndex] = relation;
    }
  }

  calculateProgress(identity: MilestoneIdentity, timingId: string): number | undefined {
    const progresses = this.getRelations(identity, timingId)
      .filter((relation) => isDefined(relation.progress))
      .map((relation) => relation.progress);
    return progresses.length ? mergePercentages(progresses) : undefined;
  }

  getRelations(identity: MilestoneIdentity, timingId: string): MilestoneRelationModel[] {
    const relationsByTimingId = (this.relationsByTid.get(this.getId(identity))?.get(timingId) ||
      []) as MilestoneRelationModel[];
    const relationsWithoutTimingId = (this.relationsByTid
      .get(this.getId(identity))
      ?.get(undefined) || []) as MilestoneRelationModel[];
    return [...relationsByTimingId, ...relationsWithoutTimingId].sort((a, b) => {
      if (a.progress > b.progress) return 1;
      if (a.progress < b.progress) return -1;
      if (isDefined(a.progress) && !isDefined(b.progress)) return -1;
      if (!isDefined(a.progress) && isDefined(b.progress)) return 1;
      return 0;
    });
  }
}

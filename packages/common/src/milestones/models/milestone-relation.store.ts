import { CalendarPlanStore } from '@/calendar-plan/models/calendar-plan.store';
import { MilestoneModel, MilestoneRelationModel, MilestoneSearchResponse } from '@/milestones';

type MilestoneIdentity = MilestoneModel | string;

/**
 * This class is used to stores time series content and related data points.
 */
export class MilestoneRelationsStore extends CalendarPlanStore<
  MilestoneModel,
  MilestoneSearchResponse
> {
  protected relationsByTid: Map<string, Map<string, MilestoneRelationModel>> = new Map();

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
    logs: Map<string, Map<string, MilestoneRelationModel>>,
  ) {
    const modelId = relation.cid;

    if (!modelId) return;

    if (!logs.has(modelId)) {
      logs.set(modelId, new Map());
    }

    logs.get(modelId).set(relation.tid, relation);
  }

  getRelations(identity: MilestoneIdentity, timingId: string): MilestoneRelationModel[] {
    const relationsByTimingId = (this.relationsByTid.get(this.getId(identity))?.get(timingId) ||
      []) as MilestoneRelationModel[];
    const relationsWithoutTimingId = (this.relationsByTid
      .get(this.getId(identity))
      ?.get(undefined) || []) as MilestoneRelationModel[];
    return [...relationsByTimingId, ...relationsWithoutTimingId];
  }
}

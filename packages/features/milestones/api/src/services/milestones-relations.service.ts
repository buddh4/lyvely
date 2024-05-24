import { Injectable } from '@nestjs/common';
import { Milestone } from '../schemas';
import {
  assureObjectId,
  DocumentIdentity,
  DBQuery,
  Content,
  ContentDao,
  ContentCondition,
  TObjectId,
  ProfileContext,
} from '@lyvely/api';
import { MilestoneRelationEvent } from '../events';
import { CalendarDateTime } from '@lyvely/dates';
import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Represents a service for retrieving milestone relations.
 * @class
 * @public
 * @constructor
 * @param {ContentDao} contentDao - The ContentDao instance for accessing content data.
 * @param {EventEmitter2} eventEmitter - The EventEmitter2 instance for emitting events.
 */
@Injectable()
export class MilestonesRelationsService {
  constructor(
    private contentDao: ContentDao,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Retrieves milestone relations based on given milestones and date.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {DocumentIdentity<Milestone>[]} milestones - An array of milestone document identities.
   * @param {CalendarDateTime} [date] - The optional date.
   * @returns {Promise<MilestoneRelationModel<TObjectId>[]>} - A promise that resolves to an array of milestone relation models.
   */
  public async getRelationsByMilestones(
    context: ProfileContext,
    milestones: DocumentIdentity<Milestone>[],
    date?: CalendarDateTime,
  ) {
    const { profile, user } = context;
    if (!milestones.length) return [];

    const contents = await this.contentDao.findAllByProfile(
      profile,
      DBQuery.and<Content>([
        ContentCondition.NOT_ARCHIVED,
        ContentCondition.withMilestones(milestones.map((mid) => assureObjectId(mid))),
      ]),
    );

    if (!contents.length) return;

    const contentTypeMap = contents.reduce((map, content) => {
      if (!map.has(content.type)) map.set(content.type, [content]);
      else map.get(content.type)?.push(content);
      return map;
    }, new Map<string, Content[]>());

    const relations = [] as MilestoneRelationModel<TObjectId>[];
    for (const contents of contentTypeMap.values()) {
      const event = new MilestoneRelationEvent({
        user,
        contents,
        date,
      });

      await this.eventEmitter.emitAsync(
        MilestoneRelationEvent.getKeyByContentType(contents[0].type),
        event,
      );

      if (!event.getResult()?.length) {
        contents.forEach((content) =>
          relations.push(new MilestoneRelationModel<TObjectId>(content)),
        );
      } else {
        event.getResult().forEach((relation) => relations.push(relation));
      }
    }

    return relations;
  }
}

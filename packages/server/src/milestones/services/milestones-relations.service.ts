import { Injectable } from '@nestjs/common';
import { Milestone } from '../schemas';
import { assureObjectId, EntityIdentity, DBQuery } from '@/core';
import { MilestoneRelationEvent } from '@/milestones';
import { CalendarDateTime, MilestoneRelationModel } from '@lyvely/common';
import { Content, ContentDao } from '@/content';
import { Profile } from '@/profiles';
import { ContentCondition } from '@/content/schemas/content-query.builder';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MilestonesRelationsService {
  constructor(private contentDao: ContentDao, private eventEmitter: EventEmitter2) {}
  public async getRelationsByMilestones(
    profile: Profile,
    milestones: EntityIdentity<Milestone>[],
    date?: CalendarDateTime,
  ) {
    if (!milestones.length) return [];

    const contents = await this.contentDao.findAllByProfile(
      profile,
      DBQuery.and<Content>([
        ContentCondition.NOTARCHIVED,
        ContentCondition.inMilestones(milestones.map((mid) => assureObjectId(mid))),
      ]),
    );

    if (!contents.length) return;

    const contentTypeMap = contents.reduce((map, content) => {
      if (!map.has(content.type)) map.set(content.type, [content]);
      else map.get(content.type).push(content);
      return map;
    }, new Map<string, Content[]>());

    const relations = [] as MilestoneRelationModel[];
    for (const contents of contentTypeMap.values()) {
      const event = new MilestoneRelationEvent({
        contents,
        date,
      });

      await this.eventEmitter.emitAsync(
        MilestoneRelationEvent.getKeyByContentType(contents[0].type),
        event,
      );

      event.getResult().forEach((relation) => relations.push(relation));
    }

    return relations;
  }
}

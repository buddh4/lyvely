import { Injectable } from '@nestjs/common';
import { Milestone } from '../schemas';
import { assureObjectId, EntityIdentity, DBQuery } from '@lyvely/core';
import { MilestoneRelationEvent } from '../events';
import { CalendarDateTime, MilestoneRelationModel } from '@lyvely/common';
import { Content, ContentDao } from '@lyvely/content';
import { Profile } from '@lyvely/profiles';
import { ContentCondition } from '@lyvely/content';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '@lyvely/users';

@Injectable()
export class MilestonesRelationsService {
  constructor(private contentDao: ContentDao, private eventEmitter: EventEmitter2) {}
  public async getRelationsByMilestones(
    profile: Profile,
    user: User,
    milestones: EntityIdentity<Milestone>[],
    date?: CalendarDateTime,
  ) {
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
      else map.get(content.type).push(content);
      return map;
    }, new Map<string, Content[]>());

    const relations = [] as MilestoneRelationModel[];
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
        contents.forEach((content) => relations.push(new MilestoneRelationModel(content)));
      } else {
        event.getResult().forEach((relation) => relations.push(relation));
      }
    }

    return relations;
  }
}

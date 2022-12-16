import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, merge } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { assureStringId, ConfigurationPath, EntityIdentity, OperationMode } from '@/core';
import { User } from '@/users';
import { ILiveEvent, ILiveProfileEvent, ILiveUserEvent } from '@lyvely/common';
import { Profile, ProfilesService } from '@/profiles';

@Injectable()
export class LiveService {
  private logger = new Logger(LiveService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly configService: ConfigService<ConfigurationPath>,
    private profilesService: ProfilesService,
  ) {}

  emitProfileEvent(event: ILiveProfileEvent) {
    this.logger.log(
      `Send live event ${event.module}.${event.name} for profile ${this.buildLiveProfileEventName(
        event.pid,
      )}`,
    );
    return this.emit(this.buildLiveProfileEventName(event.pid), event);
  }

  emitUserEvent(event: ILiveUserEvent) {
    this.logger.log(
      `Send live event ${event.module}.${event.name} to user ${this.buildLiveUserEventName(
        event.uid,
      )}`,
    );
    return this.emit(this.buildLiveUserEventName(event.uid), event);
  }

  private emit(liveEventName: string, event: ILiveEvent) {
    if (this.isStandaloneServer()) {
      this.eventEmitter.emit(liveEventName, { data: event });
    } else {
      // TODO: redis publish
    }
  }

  async subscribeUser(user: User): Promise<Observable<any>> {
    if (this.isStandaloneServer()) {
      const observables = new Set(
        (await this.profilesService.findProfileRelationsByUser(user)).map((relation) =>
          fromEvent(this.eventEmitter, this.buildLiveProfileEventName(relation.pid)),
        ),
      );

      observables.add(fromEvent(this.eventEmitter, this.buildLiveUserEventName(user)));
      this.logger.log(`Subscribe user to ${this.buildLiveUserEventName(user)}`);
      return merge(...observables);
    } else {
      // TODO: redis subscription
    }
  }

  private buildLiveProfileEventName(pid: EntityIdentity<Profile>) {
    return `live.profile.${assureStringId(pid)}`;
  }

  private buildLiveUserEventName(uid: EntityIdentity<User>) {
    return `live.user.${assureStringId(uid)}`;
  }

  private isStandaloneServer() {
    return this.configService.get('operationMode') === OperationMode.STANDALONE;
  }
}

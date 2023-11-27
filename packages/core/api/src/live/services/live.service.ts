import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, merge } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { assureStringId, EntityIdentity } from '@/core';
import { ConfigurationPath, OperationMode } from '@/config';
import { OptionalUser, User } from '@/users';
import {
  ILiveEvent,
  ILiveProfileEvent,
  ILiveUserEvent,
  ForbiddenServiceException,
} from '@lyvely/interface';
import {
  Profile,
  ProfileRelationsService,
  ProfilesService,
  ProfileVisibilityPolicy,
} from '@/profiles';
import { InjectPolicy } from '@/policies';

@Injectable()
export class LiveService {
  private logger = new Logger(LiveService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly configService: ConfigService<ConfigurationPath>,
    private profilesService: ProfilesService,
    private profileRelationsService: ProfileRelationsService,
    @InjectPolicy(ProfileVisibilityPolicy.name)
    private profileVisibilityPolicy: ProfileVisibilityPolicy,
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
    // TODO: filter by visibility or permission
    // TODO: reconnect on visibility change
    if (this.isStandaloneServer()) {
      const observables = new Set(
        (await this.profileRelationsService.findAllProfileRelationsByUser(user)).map((relation) =>
          fromEvent(this.eventEmitter, this.buildLiveProfileEventName(relation.pid!)),
        ),
      );

      observables.add(fromEvent(this.eventEmitter, this.buildLiveUserEventName(user)));
      return merge(...observables);
    } else {
      return undefined as any;
      // TODO: redis subscription
    }
  }

  async subscribeGuest(user: OptionalUser, pid: string, oid?: string): Promise<Observable<any>> {
    // TODO: filter by visibility or permission
    // TODO: reconnect on visibility change
    if (this.isStandaloneServer()) {
      const context = await this.profilesService.findProfileContext(user, pid, oid);

      if (!(await this.profileVisibilityPolicy.verify(context))) {
        throw new ForbiddenServiceException();
      }

      return fromEvent(this.eventEmitter, this.buildLiveProfileEventName(context.pid!));
    } else {
      return undefined as any;
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

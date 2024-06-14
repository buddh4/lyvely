import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, merge } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { assureStringId, DocumentIdentity } from '@/core';
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
    private profileVisibilityPolicy: ProfileVisibilityPolicy
  ) {}

  emitGlobalEvent(event: ILiveEvent) {
    return this.emit(this.buildLiveGlobalEventName(), event);
  }

  emitProfileEvent(event: ILiveProfileEvent) {
    return this.emit(this.buildLiveProfileEventName(event.pid), event);
  }

  emitUserEvent(event: ILiveUserEvent) {
    return this.emit(this.buildLiveUserEventName(event.uid), event);
  }

  private emit(liveEventName: string, event: ILiveEvent) {
    if (this.isStandaloneServer()) {
      this.eventEmitter.emit(liveEventName, { data: event });
    } else {
      // TODO: redis publish
    }
  }

  async subscribe(user: OptionalUser, pid?: string): Promise<Observable<any>> {
    // TODO: filter by visibility or permission
    // TODO: reconnect on visibility change
    if (this.isStandaloneServer()) {
      const pids: DocumentIdentity<Profile>[] = (
        await this.profileRelationsService.findAllProfileRelationsByUser(user)
      ).map((relation) => relation.pid);

      if (pid && !pids.find((relationPid) => assureStringId(relationPid) === pid)) {
        await this.verifyNonRelationAccess(user, pid);
      }

      if (pid) pids.push(pid);

      const observables = new Set(
        pids.map((profileId) =>
          fromEvent(this.eventEmitter, this.buildLiveProfileEventName(profileId))
        )
      );

      if (user) {
        observables.add(fromEvent(this.eventEmitter, this.buildLiveUserEventName(user)));
      }

      observables.add(fromEvent(this.eventEmitter, this.buildLiveGlobalEventName()));

      return merge(...observables);
    } else {
      return undefined as any;
      // TODO: redis subscription
    }
  }

  async verifyNonRelationAccess(user: OptionalUser, pid: string) {
    const context = await this.profilesService.findProfileContext(user, pid);
    if (!(await this.profileVisibilityPolicy.verify(context))) {
      throw new ForbiddenServiceException();
    }
  }

  private buildLiveProfileEventName(pid: DocumentIdentity<Profile>) {
    return `live.profile.${assureStringId(pid)}`;
  }

  private buildLiveUserEventName(uid: DocumentIdentity<User>) {
    return `live.user.${assureStringId(uid)}`;
  }

  private buildLiveGlobalEventName() {
    return `live.global`;
  }

  private isStandaloneServer() {
    return (
      this.configService.get('operationMode', OperationMode.STANDALONE) === OperationMode.STANDALONE
    );
  }
}

import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Task } from '../schemas';
import { TaskModel, TaskWithUsersModel } from '@lyvely/common';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Task, TaskModel);
      createMap(mapper, Task, TaskWithUsersModel);
    };
  }
}

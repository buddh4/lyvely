import { getObjectId } from '@/test';
import { Task } from './index';
import {
  DataPointInputType,
  DataPointValueType,
  toTimingId,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { expect } from '@jest/globals';

describe('Task', () => {
  describe('setDoneBy', () => {
    it('set done by user on shared task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);

      expect(task.doneBy.length).toEqual(1);
      expect(task.doneBy[0].uid).toEqual(user1._id);
      expect(task.doneBy[0].tid).toEqual(tid);
      expect(task.doneBy[0].date).toEqual(date);
    });

    it('set done by multiple user on shared task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const tid2 = toTimingId('2021-04-05');
      const date = new Date();
      const date2 = new Date('2022-02-20');

      task.setDoneBy(user1, tid, date);
      task.setDoneBy(user2, tid2, date2);

      expect(task.doneBy.length).toEqual(1);
      expect(task.doneBy[0].uid).toEqual(user2._id);
      expect(task.doneBy[0].tid).toEqual(tid2);
      expect(task.doneBy[0].date).toEqual(date2);
    });

    it('set done by user on per user task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.PerUser,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);

      expect(task.doneBy.length).toEqual(1);
      expect(task.doneBy[0].uid).toEqual(user1._id);
      expect(task.doneBy[0].tid).toEqual(tid);
      expect(task.doneBy[0].date).toEqual(date);
    });

    it('set done by multiple user on per user task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.PerUser,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const tid2 = toTimingId('2021-04-05');
      const date = new Date();
      const date2 = new Date('2022-02-20');

      task.setDoneBy(user1, tid, date);
      task.setDoneBy(user2, tid2, date2);

      expect(task.doneBy.length).toEqual(2);
      expect(task.doneBy[0].uid).toEqual(user1._id);
      expect(task.doneBy[0].tid).toEqual(tid);
      expect(task.doneBy[0].date).toEqual(date);

      expect(task.doneBy[1].uid).toEqual(user2._id);
      expect(task.doneBy[1].tid).toEqual(tid2);
      expect(task.doneBy[1].date).toEqual(date2);
    });

    it('set redundant done by multiple user on per user task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.PerUser,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const tid2 = toTimingId('2021-04-05');
      const date = new Date();
      const date2 = new Date('2022-02-20');

      task.setDoneBy(user1, tid, date);
      task.setDoneBy(user2, tid2, date2);
      task.setDoneBy(user1, tid2, date2);

      expect(task.doneBy.length).toEqual(2);
      expect(task.doneBy[0].uid).toEqual(user1._id);
      expect(task.doneBy[0].tid).toEqual(tid2);
      expect(task.doneBy[0].date).toEqual(date2);

      expect(task.doneBy[1].uid).toEqual(user2._id);
      expect(task.doneBy[1].tid).toEqual(tid2);
      expect(task.doneBy[1].date).toEqual(date2);
    });
  });

  describe('setUndoneBy', () => {
    it('set undone by user on shared task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);
      task.setUndoneBy(user1);

      expect(task.doneBy.length).toEqual(0);
    });

    it('set undone by another user on shared task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);
      task.setUndoneBy(user2);

      expect(task.doneBy.length).toEqual(0);
    });

    it('set undone by user on per user task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.PerUser,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);
      task.setDoneBy(user2, tid, date);

      task.setUndoneBy(user1);

      expect(task.isDoneByUser(user1)).toEqual(false);
      expect(task.isDoneByUser(user2)).toEqual(true);
    });

    it('set undone by another user on per user task', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });
      const user3 = new User({ _id: getObjectId('user3') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.PerUser,
          },
        },
      });

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);
      task.setDoneBy(user2, tid, date);

      task.setUndoneBy(user3);

      expect(task.isDoneByUser(user1)).toEqual(true);
      expect(task.isDoneByUser(user2)).toEqual(true);
    });
  });

  describe('isDoneByUser', () => {
    it('is done by user on shared', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
          },
        },
      });

      expect(task.isDoneByUser(user1)).toEqual(false);
      expect(task.isDoneByUser(user2)).toEqual(false);

      const tid = toTimingId('2021-04-03');
      const date = new Date();
      task.setDoneBy(user1, tid, date);

      expect(task.isDoneByUser(user1)).toEqual(true);
      expect(task.isDoneByUser(user2)).toEqual(false);
    });

    it('is done by user on per user', async () => {
      const user1 = new User({ _id: getObjectId('user1') });
      const user2 = new User({ _id: getObjectId('user2') });

      const task = new Task(new Profile(user1), user1, {
        config: {
          timeSeries: {
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.PerUser,
          },
        },
      });

      expect(task.isDoneByUser(user1)).toEqual(false);
      expect(task.isDoneByUser(user2)).toEqual(false);

      const tid = toTimingId('2021-04-03');
      const date = new Date();

      task.setDoneBy(user1, tid, date);

      expect(task.isDoneByUser(user1)).toEqual(true);
      expect(task.isDoneByUser(user2)).toEqual(false);

      task.setDoneBy(user2, tid, date);

      expect(task.isDoneByUser(user1)).toEqual(true);
      expect(task.isDoneByUser(user2)).toEqual(true);
    });
  });
});

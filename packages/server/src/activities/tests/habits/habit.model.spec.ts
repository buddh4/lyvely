import { Profile } from '@/profiles';
import { User } from '@/users';
import { Habit } from '../../schemas';
import {
  CalendarIntervalEnum,
  CreatedAsType,
  DataPointInputType,
  DataPointValueType,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { expect } from '@jest/globals';
import mongoose from 'mongoose';
import { CheckboxNumberDataPointConfig, DataPointConfigFactory } from '@/time-series';
import { Tag } from '@/tags';
import { getObjectId } from '@/test';

describe('Content Model', () => {
  let user: User;
  let profile: Profile;

  beforeEach(async () => {
    user = new User({ _id: new mongoose.Types.ObjectId() });
    profile = new Profile(user, { _id: new mongoose.Types.ObjectId() });
    profile.tags = [new Tag({ _id: getObjectId('Test1'), name: 'Test1' })];
  });

  describe('Habit', () => {
    it('create', async () => {
      const habit = Habit.create(profile, user, {
        title: 'Test',
        text: 'Some Test Habit',
        score: 5,
        max: 3,
        min: 2,
        optimal: 2,
        interval: CalendarIntervalEnum.Monthly,
        inputType: DataPointInputType.Checkbox,
        userStrategy: UserAssignmentStrategy.Shared,
        tagNames: ['Test1'],
      });

      expect(habit.pid).toEqual(profile._id);
      expect(habit.meta.createdBy).toEqual(user._id);
      expect(habit.meta.createdAs).toBeDefined();
      expect(habit.meta.createdAs.type).toEqual(CreatedAsType.User);
      expect(habit.meta.createdAs.authorId).toEqual(user._id);
      expect(habit.content.title).toEqual('Test');
      expect(habit.config.score).toEqual(5);
      expect(habit.timeSeriesConfig.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
      );
      expect(habit.timeSeriesConfig.inputType).toEqual(DataPointInputType.Checkbox);
      expect(habit.timeSeriesConfig.valueType).toEqual(DataPointValueType.Number);
      expect(habit.timeSeriesConfig instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(habit.timeSeriesConfig.max).toEqual(3);
      expect(habit.timeSeriesConfig.min).toEqual(2);
      expect(habit.timeSeriesConfig.optimal).toEqual(2);
      expect(habit.timeSeriesConfig.getSettings()).toBeDefined();
      expect(habit.timeSeriesConfig.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(habit.content.text).toEqual('Some Test Habit');
      expect(habit.tagIds.length).toEqual(1);
      expect(habit.tagIds[0]).toEqual(profile.tags[0]._id);
    });
  });
});

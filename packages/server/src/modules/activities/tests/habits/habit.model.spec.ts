import { Profile } from '../../../profiles';
import { User } from '../../../users';
import { Habit } from '../../schemas';
import { CalendarIntervalEnum, DataPointInputStrategy } from '@lyvely/common';
import { expect } from '@jest/globals';
import { CreatedAsType } from '../../../content';
import mongoose from 'mongoose';
import { CheckboxNumberDataPointConfig } from '../../../../interfaces/time-series';
import { Tag } from "../../../tags";
import { getObjectId } from "../../../test/utils/test.utils";

describe('Content Model', () => {
  let user: User;
  let profile: Profile;

  beforeEach(async () => {
    user = new User({ _id: new mongoose.Types.ObjectId() });
    profile = new Profile(user, { _id: new mongoose.Types.ObjectId() });
    profile.tags = [new Tag({ _id: getObjectId('Test1'), name: 'Test1' })]
  });

  describe('Habit', () => {
    it('create', async() => {
      const habit = Habit.create(profile, user, {
        title: 'Test',
        text: 'Some Test Habit',
        score: 5,
        max: 3,
        min: 2,
        optimal: 2,
        interval: CalendarIntervalEnum.Monthly,
        tagNames: ['Test1']
      });

      expect(habit.pid).toEqual(profile._id);
      expect(habit.createdBy).toEqual(user._id);
      expect(habit.createdAs).toBeDefined();
      expect(habit.createdAs.type).toEqual(CreatedAsType.User);
      expect(habit.createdAs.authorId).toEqual(user._id);
      expect(habit.title).toEqual('Test');
      expect(habit.score).toEqual(5);
      expect(habit.dataPointConfig.strategy).toEqual(DataPointInputStrategy.CheckboxNumber);
      expect(habit.dataPointConfig instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(habit.dataPointConfig.max).toEqual(3);
      expect(habit.dataPointConfig.min).toEqual(2);
      expect(habit.dataPointConfig.optimal).toEqual(2);
      expect(habit.dataPointConfig.getSettings()).toBeDefined();
      expect(habit.dataPointConfig.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(habit.text).toEqual( 'Some Test Habit');
      expect(habit.tagIds.length).toEqual( 1);
      expect(habit.tagIds[0]).toEqual( profile.tags[0]._id);
    });
  });
});

import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import {
  CalendarIntervalEnum,
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ITextDataPointConfig,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { JournalsService } from '@/journals/services/journals.service';
import { JournalsDao } from '@/journals/daos';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { Content } from '@/content';
import { Journal, JournalSchema } from '@/journals/schemas';
import { NumberDataPointConfig, TextareaTextDataPointConfig } from '@/time-series';

const Models = [
  {
    name: Journal.name,
    collection: Content.collectionName(),
    schema: JournalSchema,
  },
];

describe('JournalService', () => {
  let journalsService: JournalsService;
  let testingModule: TestingModule;
  let testData: TestDataUtils;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [JournalsDao, JournalsService],
      Models,
    ).compile();
    journalsService = testingModule.get<JournalsService>(JournalsService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('create Journal', () => {
    it('create text journal', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const journal = await journalsService.createContent(profile, user, {
        title: 'How are you today?',
        text: 'Enter some infos about your day.',
        valueType: DataPointValueType.Text,
        inputType: DataPointInputType.Textarea,
        interval: CalendarIntervalEnum.Daily,
        userStrategy: UserAssignmentStrategy.PerUser,
      });

      const config = journal.config.timeSeries as ITextDataPointConfig;

      expect(journal._id).toBeDefined();
      expect(config instanceof TextareaTextDataPointConfig).toEqual(true);
      expect(journal.content.title).toEqual('How are you today?');
      expect(journal.content.text).toEqual('Enter some infos about your day.');
      expect(config.interval).toEqual(CalendarIntervalEnum.Daily);
      expect(config.valueType).toEqual(DataPointValueType.Text);
      expect(config.inputType).toEqual(DataPointInputType.Textarea);
      expect(config.userStrategy).toEqual(UserAssignmentStrategy.PerUser);
      expect(config.required).toEqual(false);
    });

    it('create invalid number journal', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const journal = await journalsService.createContent(profile, user, {
        title: 'How many?',
        text: 'Some description...',
        valueType: DataPointValueType.Number,
        inputType: DataPointInputType.Checkbox,
        interval: CalendarIntervalEnum.Daily,
        userStrategy: UserAssignmentStrategy.PerUser,
        min: 2,
        max: 5,
        optimal: 3,
      });

      const config = journal.config.timeSeries as INumberDataPointConfig;

      expect(journal._id).toBeDefined();
      expect(config instanceof NumberDataPointConfig).toEqual(true);
      expect(journal.content.title).toEqual('How many?');
      expect(journal.content.text).toEqual('Some description...');
      expect(config.interval).toEqual(CalendarIntervalEnum.Daily);
      expect(config.valueType).toEqual(DataPointValueType.Number);
      expect(config.inputType).toEqual(DataPointInputType.Checkbox);
      expect(config.userStrategy).toEqual(UserAssignmentStrategy.PerUser);
      expect(config.min).toEqual(2);
      expect(config.max).toEqual(5);
      expect(config.optimal).toEqual(3);
    });

    it('sortOrder creation', async () => {
      /* const { user, profile } = await testData.createUserAndProfile();
      const habit1 = await createHabit(user, profile);
      const habit2 = await createHabit(user, profile);

      expect(habit1.meta.sortOrder).toEqual(0);
      expect(habit2.meta.sortOrder).toEqual(1);*/
    });
  });
});

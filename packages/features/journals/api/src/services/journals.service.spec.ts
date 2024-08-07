import { CalendarInterval } from '@lyvely/dates';
import { CreateJournalModel } from '@lyvely/journals-interface';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ISelectionDataPointConfig,
  ITextDataPointConfig,
  CheckboxNumberDataPointConfig,
  RadioSelectionDataPointConfig,
  TextareaTextDataPointConfig,
} from '@lyvely/time-series';
import {
  IntegrityException,
  UserAssignmentStrategy,
  ProfileTestDataUtils,
  buildContentTest,
} from '@lyvely/api';
import { JournalsService } from '../services';
import { JournalsDao } from '../daos';
import { ILyvelyTestingModule } from '@lyvely/api';
import { Journal, JournalSchema } from '../schemas';
import { getContentModelDefinition } from '@lyvely/api';

describe('JournalService', () => {
  let journalsService: JournalsService;
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'journals_service';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .providers([JournalsDao, JournalsService])
      .models([getContentModelDefinition([{ name: Journal.name, schema: JournalSchema }])])
      .compile();
    journalsService = testingModule.get(JournalsService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  async function createJournal(obj: Partial<CreateJournalModel> = {}) {
    const { user, profile, context } = await testData.createUserAndProfile();
    const journal = await journalsService.createContent(
      context,
      new CreateJournalModel({
        title: 'Test Journal Title',
        text: 'Test Journal Text',
        valueType: DataPointValueType.Text,
        inputType: DataPointInputType.Textarea,
        interval: CalendarInterval.Daily,
        userStrategy: UserAssignmentStrategy.PerUser,
        ...obj,
      })
    );

    return { user, profile, context, journal };
  }

  describe('create Journal', () => {
    it('create text journal', async () => {
      const { journal } = await createJournal({
        title: 'How are you today?',
        text: 'Enter some infos about your day.',
        valueType: DataPointValueType.Text,
        inputType: DataPointInputType.Textarea,
        interval: CalendarInterval.Daily,
        userStrategy: UserAssignmentStrategy.PerUser,
      });

      const config = journal.config.timeSeries as ITextDataPointConfig;

      expect(journal._id).toBeDefined();
      expect(config instanceof TextareaTextDataPointConfig).toEqual(true);
      expect(journal.content.title).toEqual('How are you today?');
      expect(journal.content.text).toEqual('Enter some infos about your day.');
      expect(config.interval).toEqual(CalendarInterval.Daily);
      expect(config.valueType).toEqual(DataPointValueType.Text);
      expect(config.inputType).toEqual(DataPointInputType.Textarea);
      expect(config.userStrategy).toEqual(UserAssignmentStrategy.PerUser);
      expect(config.required).toEqual(false);
    });

    it('create checkbox journal', async () => {
      const { journal } = await createJournal({
        valueType: DataPointValueType.Number,
        inputType: DataPointInputType.Checkbox,
        min: 1,
        max: 5,
        optimal: 3,
      });

      const config = journal.config.timeSeries as INumberDataPointConfig;

      expect(journal._id).toBeDefined();
      expect(config instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(config.valueType).toEqual(DataPointValueType.Number);
      expect(config.inputType).toEqual(DataPointInputType.Checkbox);
      expect(config.min).toEqual(1);
      expect(config.max).toEqual(5);
      expect(config.optimal).toEqual(3);
    });

    it('create radio journal', async () => {
      const { journal } = await createJournal({
        valueType: DataPointValueType.Selection,
        inputType: DataPointInputType.Radio,
        options: ['Option A', 'Option B'],
      });

      const config = journal.config.timeSeries as ISelectionDataPointConfig;

      expect(journal._id).toBeDefined();
      expect(config instanceof RadioSelectionDataPointConfig).toEqual(true);
      expect(config.valueType).toEqual(DataPointValueType.Selection);
      expect(config.inputType).toEqual(DataPointInputType.Radio);
      expect(config.options).toBeDefined();
      expect(config.options.length).toEqual(2);
      expect(config.options[0]).toEqual('Option A');
      expect(config.options[1]).toEqual('Option B');
    });

    it('creating journal with invalid strategy should throw error', async () => {
      expect.assertions(2);

      try {
        await createJournal({
          valueType: DataPointValueType.Number,
          inputType: DataPointInputType.Radio,
        });
      } catch (err) {
        const e = err as any;
        expect(e instanceof IntegrityException).toBeDefined();
        expect(e.message).toEqual(
          "Could not initialize data point config with strategy 'number_radio'"
        );
      }
    });
  });

  describe('update Journal', () => {
    it('update journal with invalid strategy should throw error', async () => {
      expect.assertions(2);
      const { context, journal } = await createJournal();
      try {
        await journalsService.updateContent(context, journal, {
          valueType: DataPointValueType.Number,
          inputType: DataPointInputType.Radio,
        });
      } catch (err) {
        const e = err as any;
        expect(e instanceof IntegrityException).toBeDefined();
        expect(e.message).toEqual(
          "Could not initialize data point config with strategy 'number_radio'"
        );
      }
    });
  });
});

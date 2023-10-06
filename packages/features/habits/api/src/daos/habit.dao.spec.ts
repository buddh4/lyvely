import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { CalendarInterval } from '@lyvely/dates';
import { Habit } from '../schemas';
import { HabitTestDataUtil, habitTestPlugin } from '../testing';
import { HabitsDao } from './habits.dao';

describe('Habits DAO', () => {
  let testingModule: LyvelyTestingModule;
  let habitsDao: HabitsDao;
  let testData: HabitTestDataUtil;

  const TEST_KEY = 'habits_dao';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([habitTestPlugin])
      .providers([HabitsDao])
      .compile();
    habitsDao = testingModule.get(HabitsDao);
    testData = testingModule.get(HabitTestDataUtil);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(habitsDao).toBeDefined();
  });

  describe('findByProfileAndId', () => {
    it('find habit by profile', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await testData.createHabit(user, profile);
      const search = await habitsDao.findByProfileAndId(profile, content._id);
      expect(search).not.toBeNull();
      expect(search?._id).toEqual(content._id);
      expect(search instanceof Habit).toEqual(true);
    });
  });

  describe('findByProfileAndTimingIds', () => {
    it('find habit', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);
      const search = await habitsDao.findByProfileAndTimingIds(profile, user, []);
      expect(search.length).toEqual(1);
      expect(search.find((c) => c.content.title === habit.content.title)).toBeDefined();
    });
  });

  describe('findByProfileAndPlan', () => {
    it('assure we do find multiple of the same type', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        interval: CalendarInterval.Daily,
      });
      const habit2 = await testData.createHabit(user, profile, {
        interval: CalendarInterval.Daily,
      });

      const result = await habitsDao.findByProfileAndInterval(profile, CalendarInterval.Daily);
      expect(result).toBeDefined();
      expect(result.length).toEqual(2);
      expect(result.find((c) => c.content.title === habit.content.title)).toBeDefined();
      expect(result.find((c) => c.content.title === habit2.content.title)).toBeDefined();
    });

    it('assure we do not include an entry of another plan', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        interval: CalendarInterval.Daily,
      });
      await testData.createHabit(user, profile, { interval: CalendarInterval.Weekly });

      const result = await habitsDao.findByProfileAndInterval(profile, CalendarInterval.Daily);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result.find((c) => c.content.title === habit.content.title)).toBeDefined();
    });
  });
});
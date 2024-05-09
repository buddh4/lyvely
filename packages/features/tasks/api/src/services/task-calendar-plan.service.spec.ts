import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import { TaskTestDataUtil, taskTestPlugin } from '../testing';
import { TasksDao } from '../daos';
import { UserDone } from '../schemas';
import { TaskCalendarPlanService } from './task-calendar-plan.service';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';

describe('TaskCalendarPlanService', () => {
  let testingModule: LyvelyTestingModule;
  let taskTimeSeriesService: TaskCalendarPlanService;
  let testData: TaskTestDataUtil;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([taskTestPlugin])
      .providers([TasksDao, TaskCalendarPlanService])
      .compile();
    taskTimeSeriesService = testingModule.get(TaskCalendarPlanService);
    testData = testingModule.get(TaskTestDataUtil);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('findByFilter', () => {
    it('find undone task', async () => {
      const { context } = await testData.createUserAndProfile('user1');
      const task = await testData.createTask(context);
      const filter = new CalendarPlanFilter(new Date());
      const models = await taskTimeSeriesService.findByFilter(context, filter);
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual(task.id);
    });

    it('find task done today within filter range', async () => {
      const { user, context } = await testData.createUserAndProfile('user1');
      const task = await testData.createTask(context, { title: 't1' }, (model) => {
        model.state.doneBy = [new UserDone(user, TaskTestDataUtil.getTodayTimingId())];
      });
      const filter = new CalendarPlanFilter(new Date());
      const models = await taskTimeSeriesService.findByFilter(context, filter);
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual(task.id);
    });

    it('find task done tomorrow within filter range', async () => {
      const { user, context } = await testData.createUserAndProfile('user1');
      const task = await testData.createTask(context, { title: 't1' }, (model) => {
        model.state.doneBy = [new UserDone(user, TaskTestDataUtil.getTomorrowTimingId())];
      });
      const filter = new CalendarPlanFilter(TaskTestDataUtil.getDateTomorrow());
      const models = await taskTimeSeriesService.findByFilter(context, filter);
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual(task.id);
    });

    it('do not include tasks done outside of filter range', async () => {
      const { user, context } = await testData.createUserAndProfile('user1');
      await testData.createTask(context, { title: 't1' }, (model) => {
        model.state.doneBy = [new UserDone(user, TaskTestDataUtil.getTomorrowTimingId())];
      });
      const filter = new CalendarPlanFilter(new Date());
      const models = await taskTimeSeriesService.findByFilter(context, filter);
      expect(models.length).toEqual(0);
    });
  });
});

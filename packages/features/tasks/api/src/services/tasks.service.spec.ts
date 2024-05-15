import { CalendarInterval, toTimingId } from '@lyvely/dates';
import { Timer, TimeSpan } from '@lyvely/timers';
import { UserAssignmentStrategy, ProtectedProfileContext, buildProfileTest } from '@lyvely/api';
import { TasksService } from './tasks.service';
import { TaskTestDataUtil, taskTestPlugin } from '../testing';
import { TasksDao } from '../daos';
import { Task, TaskState } from '../schemas';
import { LyvelyTestingModule } from '@lyvely/testing';

describe('TaskService', () => {
  let testingModule: LyvelyTestingModule;
  let taskService: TasksService;
  let testData: TaskTestDataUtil;
  let taskDao: TasksDao;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .plugins([taskTestPlugin])
      .providers([TasksDao, TasksService])
      .compile();
    taskService = testingModule.get(TasksService);
    testData = testingModule.get(TaskTestDataUtil);
    taskDao = testingModule.get(TasksDao);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  async function createTask(
    context: ProtectedProfileContext,
    userStrategy: UserAssignmentStrategy,
    timers: Timer[] = [],
  ) {
    const task = await taskService.createContent(context, {
      title: 'Do something!',
      score: 5,
      interval: CalendarInterval.Monthly,
      userStrategy: userStrategy,
    });

    if (timers.length) {
      await taskDao.updateOneSetById(task, { state: new TaskState({ timers }) });
    }
    return task;
  }

  it('create', async () => {
    const { context } = await testData.createUserAndProfile();
    const preCreateTs = Date.now();
    const task = await createTask(context, UserAssignmentStrategy.Shared);
    expect(task.type).toBe(Task.name);
    expect(task.meta.sortOrder).toBeGreaterThanOrEqual(preCreateTs);
    expect(task.meta.sortOrder).toBeLessThanOrEqual(Date.now());
    expect(task.meta.createdAt).toBeDefined();
    expect(task.meta.updatedAt).toBeDefined();
    expect(task.config.interval).toEqual(CalendarInterval.Monthly);
    expect(task.config.score).toEqual(5);
    expect(task.content.title).toEqual('Do something!');
    expect(task.state.doneBy).toEqual([]);
  });

  describe('setDone', () => {
    it('set done on shared task', async () => {
      const { owner, profile, ownerContext } = await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared);

      await taskService.setDone(ownerContext, task, '2021-04-03');

      const search = await testData.findTaskById(task);
      expect(search!.state.doneBy.length).toEqual(1);
      expect(search!.state.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(search!.state.doneBy[0].uid).toEqual(owner._id);

      expect(task.state.doneBy.length).toEqual(1);
      expect(task.state.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(task.state.doneBy[0].uid).toEqual(owner._id);

      expect(profile.score).toEqual(5);
    });

    it('set multiple done on shared task', async () => {
      const { ownerContext, member, memberContext, profile } = await testData.createSimpleGroup();

      const task = await createTask(memberContext, UserAssignmentStrategy.Shared);

      await taskService.setDone(ownerContext, task, '2021-04-03');
      await taskService.setDone(memberContext, task, '2021-04-05');

      const search = await testData.findTaskById(task);
      expect(search!.state.doneBy.length).toEqual(1);
      expect(search!.state.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(search!.state.doneBy[0].uid).toEqual(member._id);

      expect(profile.score).toEqual(5);
    });

    it('set done on per-user task', async () => {
      const { owner, ownerContext, profile } = await testData.createSimpleGroup();

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);

      await taskService.setDone(ownerContext, task, '2021-04-03');
      const search = await testData.findTaskById(task);
      expect(search!.state.doneBy.length).toEqual(1);
      expect(search!.state.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(search!.state.doneBy[0].uid).toEqual(owner._id);

      expect(task.state.doneBy.length).toEqual(1);
      expect(task.state.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(task.state.doneBy[0].uid).toEqual(owner._id);
    });

    it('set multiple done by on per-user task', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);

      await taskService.setDone(ownerContext, task, '2021-04-03');
      await taskService.setDone(memberContext, task, '2021-04-05');

      const search = await testData.findTaskById(task);
      expect(search!.state.doneBy.length).toEqual(2);
      expect(search!.state.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(search!.state.doneBy[0].uid).toEqual(owner._id);
      expect(search!.state.doneBy[1].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(search!.state.doneBy[1].uid).toEqual(member._id);

      expect(task.state.doneBy.length).toEqual(2);
      expect(task.state.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(task.state.doneBy[0].uid).toEqual(owner._id);
      expect(task.state.doneBy[1].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(task.state.doneBy[1].uid).toEqual(member._id);
    });

    it('set multiple done by single user on per-user task', async () => {
      const { owner, profile, ownerContext } = await testData.createSimpleGroup();

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);

      await taskService.setDone(ownerContext, task, '2021-04-03');
      await taskService.setDone(ownerContext, task, '2021-04-05');

      const search = await testData.findTaskById(task);
      expect(search!.state.doneBy.length).toEqual(1);
      expect(search!.state.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(search!.state.doneBy[0].uid).toEqual(owner._id);

      expect(task.state.doneBy.length).toEqual(1);
      expect(task.state.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(task.state.doneBy[0].uid).toEqual(owner._id);
    });
  });

  describe('setUndone', () => {
    it('set undone on shared task', async () => {
      const { memberContext, profile } = await testData.createSimpleGroup();
      const task = await createTask(memberContext, UserAssignmentStrategy.Shared);

      await taskService.setDone(memberContext, task, '2021-04-03');
      await taskService.setUndone(memberContext, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search!.state.doneBy).toEqual([]);
      expect(task.state.doneBy).toEqual([]);
    });

    it('set undone by another user on shared task', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared);

      await taskService.setDone(memberContext, task, '2021-04-03');
      await taskService.setUndone(ownerContext, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search!.state.doneBy).toEqual([]);
      expect(task.state.doneBy).toEqual([]);
    });

    it('set undone on per user task', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);

      await taskService.setDone(memberContext, task, '2021-04-03');
      await taskService.setUndone(memberContext, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search!.state.doneBy).toEqual([]);
      expect(task.state.doneBy).toEqual([]);
    });

    it('set undone on per user task with multiple doneBy', async () => {
      const { owner, ownerContext, member, memberContext } = await testData.createSimpleGroup();
      const task = await createTask(memberContext, UserAssignmentStrategy.PerUser);

      await taskService.setDone(memberContext, task, '2021-04-03');
      await taskService.setDone(ownerContext, task, '2021-04-03');
      await taskService.setUndone(memberContext, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search!.state.doneBy.length).toEqual(1);
      expect(search!.isDoneByUser(owner)).toEqual(true);
      expect(search!.isDoneByUser(member)).toEqual(false);
      expect(task.state.doneBy.length).toEqual(1);
      expect(task.isDoneByUser(owner)).toEqual(true);
      expect(task.isDoneByUser(member)).toEqual(false);
    });
  });

  describe('startTimer', () => {
    it('start new timer on shared task', async () => {
      const { owner, ownerContext, member } = await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared);
      const timer = await taskService.startTimer(ownerContext, task);
      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)!.isStarted()).toEqual(true);
      expect(search!.state.timers.length).toEqual(1);
    });

    it('start new timer on per user task', async () => {
      const { owner, ownerContext, member } = await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);
      const timer = await taskService.startTimer(ownerContext, task);
      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)).toBeUndefined();
      expect(search!.state.timers.length).toEqual(1);
    });

    it('start already started timer on shared task', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared);
      await taskService.startTimer(ownerContext, task);
      const timer = await taskService.startTimer(memberContext, task);

      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)!.isStarted()).toEqual(true);
      expect(search!.state.timers.length).toEqual(1);
    });

    it('start already started timer on per user task', async () => {
      const { owner, ownerContext, member } = await testData.createSimpleGroup();
      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);
      await taskService.startTimer(ownerContext, task);
      const timer = await taskService.startTimer(ownerContext, task);

      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)).toBeUndefined();
      expect(search!.state.timers.length).toEqual(1);
    });

    it('start stopped timer on shared task', async () => {
      const { owner, ownerContext, member } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer();
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000 }];

      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared, [existingTimer]);

      expect(task.getTimer(owner)).not.toBeUndefined();
      expect(task.getTimer(owner)!.isStarted()).toEqual(false);

      await taskService.startTimer(ownerContext, task);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)!.spans.length).toEqual(2);
      expect(search!.state.timers.length).toEqual(1);
    });

    it('start stopped timer on per user task', async () => {
      const { owner, ownerContext, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000, uid: owner._id }];

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser, [existingTimer]);

      expect(task.getTimer(owner)).not.toBeUndefined();
      expect(task.getTimer(owner)!.isStarted()).toEqual(false);

      await taskService.startTimer(ownerContext, task);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(owner)!.spans.length).toEqual(2);
      expect(search!.getTimer(member)).toBeUndefined();
      expect(search!.state.timers.length).toEqual(1);
    });

    it('start multiple timers on per user task', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000, uid: owner._id }];

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser, [existingTimer]);

      await taskService.startTimer(ownerContext, task);
      await taskService.startTimer(memberContext, task);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(true);
      expect(search!.getTimer(owner)!.spans.length).toEqual(2);
      expect(search!.getTimer(member)!.isStarted()).toEqual(true);
      expect(search!.getTimer(member)!.spans.length).toEqual(1);
      expect(search!.state.timers.length).toEqual(2);
    });
  });

  describe('stopTimer', () => {
    it('stop timer on shared task', async () => {
      const { owner, ownerContext, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, uid: owner._id }];

      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared, [existingTimer]);
      const timer = await taskService.stopTimer(ownerContext, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(false);
      expect(search!.getTimer(member)!.isStarted()).toEqual(false);
      expect(search!.state.timers.length).toEqual(1);
    });

    it('stop non existing timer on shared task', async () => {
      const { owner, ownerContext, profile } = await testData.createSimpleGroup();

      const task = await createTask(ownerContext, UserAssignmentStrategy.Shared);
      const timer = await taskService.stopTimer(ownerContext, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)).toBeUndefined();
    });

    it('stop non existing timer on per user task', async () => {
      const { owner, ownerContext, profile } = await testData.createSimpleGroup();

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser);
      const timer = await taskService.stopTimer(ownerContext, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)).toBeUndefined();
    });

    it('stop timer on per user task', async () => {
      const { owner, ownerContext, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000, uid: owner._id }];

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser, [existingTimer]);
      const timer = await taskService.stopTimer(ownerContext, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(false);
      expect(search!.getTimer(member)).toBeUndefined();
      expect(search!.state.timers.length).toEqual(1);
    });

    it('stop two timer on per user task', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const ownerTimer = new Timer(owner);
      ownerTimer.spans = <Array<TimeSpan>>[{ from: start, uid: owner._id }];
      const memberTimer = new Timer(member);
      memberTimer.spans = <Array<TimeSpan>>[{ from: start, uid: member._id }];

      const task = await createTask(ownerContext, UserAssignmentStrategy.PerUser, [
        ownerTimer,
        memberTimer,
      ]);
      await taskService.stopTimer(ownerContext, task);
      await taskService.stopTimer(memberContext, task);

      const search = await testData.findTaskById(task.id);
      expect(search!.getTimer(owner)!.isStarted()).toEqual(false);
      expect(search!.getTimer(member)!.isStarted()).toEqual(false);
      expect(search!.state.timers.length).toEqual(2);
    });
  });
});

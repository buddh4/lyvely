import { queuePromise } from './promise.util';
import { noop } from './function.util';

class SomeService {
  public counter = 0;
  public promiseCreated = 0;

  async doSomething(shouldFail = false) {
    this.promiseCreated++;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject('Some Error...');
        } else {
          resolve(++this.counter);
        }
      }, 500);
    });
  }
}

describe('promise util', () => {
  describe('queuePromise', () => {
    it('make sure promise does only run once', async () => {
      const someService = new SomeService();
      await Promise.all([
        queuePromise('counter1', () => someService.doSomething()),
        queuePromise('counter1', () => someService.doSomething()),
        queuePromise('counter1', () => someService.doSomething()),
      ]);
      expect(someService.counter).toEqual(1);
      expect(someService.promiseCreated).toEqual(1);
    });

    it('make sure multiple calls are queued', async () => {
      const someService = new SomeService();
      await Promise.all([
        queuePromise('counter2', () => someService.doSomething()),
        queuePromise('counter2', () => someService.doSomething()),
      ]);

      await Promise.all([
        queuePromise('counter3', () => someService.doSomething()),
        queuePromise('counter3', () => someService.doSomething()),
      ]);

      expect(someService.counter).toEqual(2);
      expect(someService.promiseCreated).toEqual(2);
    });

    it('make sure errors can be catched', async () => {
      const someService = new SomeService();
      let catches = 0;

      await Promise.all([
        queuePromise('counter4', () => someService.doSomething(true)).catch((err) => {
          expect(err).toEqual('Some Error...');
          catches++;
        }),
        queuePromise('counter4', () => someService.doSomething()).catch((err) => {
          expect(err).toEqual('Some Error...');
          catches++;
        }),
      ]);

      expect(someService.counter).toEqual(0);
      expect(someService.promiseCreated).toEqual(1);
      expect(catches).toEqual(2);
    });

    it('make sure promise is queued after error', async () => {
      const someService = new SomeService();

      await queuePromise('counter5', () => someService.doSomething(true)).catch(noop);
      const result = await queuePromise('counterB', () => someService.doSomething(false));

      expect(someService.counter).toEqual(1);
      expect(result).toEqual(1);
      expect(someService.promiseCreated).toEqual(2);
    });

    it('make sure uncatched error is thrown', async () => {
      const someService = new SomeService();
      expect.assertions(2);

      try {
        await queuePromise('counter6', () => someService.doSomething(true));
      } catch (err) {
        expect(err).toEqual('Some Error...');
      }

      const result = await queuePromise('counter6', () => someService.doSomething());
      expect(result).toEqual(1);
    });
  });
});

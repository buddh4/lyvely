import 'reflect-metadata';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
/*import { closeInMongodConnections } from '@lyvely/testing';

afterEach(async () => {
  await closeInMongodConnections();
});
*/

useDayJsDateTimeAdapter();

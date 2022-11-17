import 'reflect-metadata';
import fs from 'fs';
import { useDayJsDateTimeAdapter } from '@lyvely/common';

useDayJsDateTimeAdapter();

/*jest.setTimeout(3000000);

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'lyvely' });

  // your code here

  await mongoose.disconnect();
})();
*/

beforeEach(() => {
  const testMailsDir = './mail/messages/test';
  if (fs.existsSync(testMailsDir)) {
    fs.readdirSync(testMailsDir).forEach((f) => fs.rmSync(`${testMailsDir}/${f}`));
  }
});

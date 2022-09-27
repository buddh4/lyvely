import 'reflect-metadata';
import fs from 'fs';
import { useDayJsDateTimeAdapter } from "@lyvely/common";

useDayJsDateTimeAdapter();

beforeEach(() => {
  const testMailsDir = './mail/messages/test';
  if(fs.existsSync(testMailsDir)) {
    fs.readdirSync(testMailsDir).forEach(f => fs.rmSync(`${testMailsDir}/${f}`));
  }
});

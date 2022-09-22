import { LyvelyAppConfiguration } from "../../core";

const testConfig: LyvelyAppConfiguration = {
  mail: {
    createMessageFiles: true,
    messagesPath: `${process.cwd()}/mail/messages/test`,
    transport: {
      jsonTransport: true
    },
    defaults: {
      from: '"No Reply" <no-reply@test>',
    },
    preview: false,
    template: {
      dir: process.cwd() + '/template/',
      options: {
        strict: true,
      },
    }
  }
};

export default testConfig;

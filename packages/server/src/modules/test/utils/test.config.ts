import { LyvelyAppConfiguration } from "../../core";

const testConfig: LyvelyAppConfiguration = {
  http: {
    host: 'localhost',
    port: 8080,
    appUrl: 'https://test.com'
  },
  mail: {
    createMessageFiles: true,
    messagesPath: `${process.cwd()}/mail/messages/test`,
    transport: {
      streamTransport: true
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

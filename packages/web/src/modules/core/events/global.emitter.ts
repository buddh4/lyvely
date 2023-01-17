import mitt from 'mitt';

// Todo: We use any for app events to prevent circular dependencies

type GlobalEvents = {
  'app.init.pre': void;
  'app.init.post': any;
  'app.mount.pre': any;
  'app.mount.post': any;
} & Record<string, any>;

export const eventBus = mitt<GlobalEvents>();

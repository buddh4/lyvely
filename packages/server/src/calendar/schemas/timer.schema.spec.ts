import { expect } from '@jest/globals';
import { Timer, TimeSpan } from '@/calendar';

describe('TimerSchema', () => {
  describe('start', () => {
    it('start timer', () => {
      const timer = new Timer();
      timer.start();
      expect(timer.spans.length).toEqual(1);
      expect(timer.isStarted()).toEqual(true);
    });
  });

  describe('stop', () => {
    it('stop timer', () => {
      const timer = new Timer();
      timer.start();
      timer.stop();
      expect(timer.spans.length).toEqual(1);
      expect(timer.isStarted()).toEqual(false);
    });
  });

  describe('overwrite', () => {
    it('overwrite open timer with higher value', () => {
      const timer = new Timer();
      const now = Date.now();
      const start = now - 1000 * 60 * 60;

      timer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000 }, { from: start + 1000 }];
      timer.overwrite(2000);

      expect(timer.calculateTotalSpan()).toEqual(2000);
      expect(timer.isStarted()).toEqual(false);
      expect(timer.spans.length).toEqual(2);
      expect(timer.spans[0].from).toEqual(start);
      expect(timer.spans[0].to).toEqual(start + 1000);
      expect(timer.spans[1].from).toEqual(start + 1000);
      expect(timer.spans[1].to).toEqual(start + 2000);
    });

    it('overwrite open timer with lower value', () => {
      const timer = new Timer();
      const now = Date.now();
      const start = now - 1000 * 60 * 60;

      timer.spans = <Array<TimeSpan>>[
        { from: start, to: start + 300 },
        { from: start + 300, to: start + 600 },
        { from: start + 600 },
      ];
      timer.overwrite(500);

      expect(timer.calculateTotalSpan()).toEqual(500);
      expect(timer.isStarted()).toEqual(false);
      expect(timer.spans.length).toEqual(2);
      expect(timer.spans[0].from).toEqual(start);
      expect(timer.spans[0].to).toEqual(start + 300);
      expect(timer.spans[1].from).toEqual(start + 300);
      expect(timer.spans[1].to).toEqual(start + 500);
    });

    it('overwrite stopped timer with higher value', () => {
      const timer = new Timer();
      const now = Date.now();
      const start = now - 1000 * 60 * 60;

      timer.spans = <Array<TimeSpan>>[
        { from: start, to: start + 1000 },
        { from: start + 1000, to: start + 2000 },
      ];

      timer.overwrite(3000);

      expect(timer.calculateTotalSpan()).toEqual(3000);
      expect(timer.isStarted()).toEqual(false);
      expect(timer.spans.length).toEqual(2);
      expect(timer.spans[0].from).toEqual(start);
      expect(timer.spans[0].to).toEqual(start + 1000);
      expect(timer.spans[1].from).toEqual(start + 1000);
      expect(timer.spans[1].to).toEqual(start + 3000);
    });

    it('overwrite stopped timer with lower value', () => {
      const timer = new Timer();
      const now = Date.now();
      const start = now - 1000 * 60 * 60;

      timer.spans = <Array<TimeSpan>>[
        { from: start, to: start + 300 },
        { from: start + 300, to: start + 600 },
        { from: start + 600, to: start + 1000 },
      ];

      timer.overwrite(500);

      expect(timer.calculateTotalSpan()).toEqual(500);
      expect(timer.isStarted()).toEqual(false);
      expect(timer.spans.length).toEqual(2);
      expect(timer.spans[0].from).toEqual(start);
      expect(timer.spans[0].to).toEqual(start + 300);
      expect(timer.spans[1].from).toEqual(start + 300);
      expect(timer.spans[1].to).toEqual(start + 500);
    });

    it('overwrite new timer', () => {
      const timer = new Timer();
      timer.overwrite(3000);

      expect(timer.calculateTotalSpan()).toEqual(3000);
      expect(timer.isStarted()).toEqual(false);
      expect(timer.spans.length).toEqual(1);
    });

    it('overwrite with 0', () => {
      const timer = new Timer();
      const now = Date.now();
      const start = now - 1000 * 60 * 60;

      timer.spans = <Array<TimeSpan>>[
        { from: start, to: start + 300 },
        { from: start + 300, to: start + 600 },
        { from: start + 600, to: start + 1000 },
      ];

      timer.overwrite(0);

      expect(timer.calculateTotalSpan()).toEqual(0);
      expect(timer.isStarted()).toEqual(false);
      expect(timer.spans.length).toEqual(0);
    });
  });
});

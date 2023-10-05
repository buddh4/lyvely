import { ScoreStatistics } from '@lyvely/statistics-interface';
import { CalendarInterval } from '@lyvely/dates';

const resource = 'statistics';

export default {
  getMonthly() {
    //return repository.get(`${resource}/monthly`);
    return {
      data: new ScoreStatistics({
        title: `Monthly scores of 2023`,
        interval: CalendarInterval.Monthly,
        data: [
          { id: '0', score: 55 },
          { id: '1', score: 101 },
          { id: '2', score: 302 },
          { id: '3', score: 174 },
          { id: '4', score: 193 },
          { id: '5', score: 242 },
          { id: '6', score: 320 },
          { id: '7', score: 200 },
          { id: '8', score: 252 },
          { id: '9', score: 322 },
          { id: '10', score: 323 },
          { id: '11', score: 111 },
        ],
      }),
    };
  },

  getDaily() {
    //return repository.get(`${resource}/monthly`);
    return {
      data: new ScoreStatistics({
        title: `Daily scores`,
        interval: CalendarInterval.Daily,
        data: [
          { id: '0', score: 5 },
          { id: '1', score: 10 },
          { id: '2', score: 20 },
          { id: '3', score: 17 },
          { id: '4', score: 19 },
          { id: '5', score: 24 },
          { id: '6', score: 32 },
        ],
      }),
    };
  },
};

import { getRelativeTime } from './date-view.util';

describe('date view util', function () {
  describe('getRelativeTime', function () {
    it('one second ago', () => {
      expect(getRelativeTime(-1000, 'en')).toEqual('1 second ago');
    });

    it('get less than minute ago', () => {
      expect(getRelativeTime(-(5 * 1000), 'en')).toEqual('5 seconds ago');
    });

    it('59 second ago', () => {
      expect(getRelativeTime(-(59 * 1000), 'en')).toEqual('59 seconds ago');
    });

    it('one minute ago', () => {
      expect(getRelativeTime(-(1000 * 60), 'en')).toEqual('1 minute ago');
    });

    it('get less than hour ago', () => {
      expect(getRelativeTime(-(5 * 1000 * 60), 'en')).toEqual('5 minutes ago');
    });

    it('59 minutes ago', () => {
      expect(getRelativeTime(-(59 * 1000 * 60), 'en')).toEqual('59 minutes ago');
    });

    it('1 hour ago', () => {
      expect(getRelativeTime(-(1000 * 60 * 60), 'en')).toEqual('1 hour ago');
    });

    it('get less than day ago', () => {
      expect(getRelativeTime(-(5 * 1000 * 60 * 60), 'en')).toEqual('5 hours ago');
    });

    it('23 hours ago', () => {
      expect(getRelativeTime(-(23 * 1000 * 60 * 60), 'en')).toEqual('23 hours ago');
    });

    it('1 day ago', () => {
      expect(getRelativeTime(-(1000 * 60 * 60 * 24), 'en')).toEqual('1 day ago');
    });

    it('get less than week ago', () => {
      expect(getRelativeTime(-(5 * 1000 * 60 * 60 * 24), 'en')).toEqual('5 days ago');
    });

    it('6 days ago', () => {
      expect(getRelativeTime(-(6 * 1000 * 60 * 60 * 24), 'en')).toEqual('6 days ago');
    });

    it('1 week ago', () => {
      expect(getRelativeTime(-(1000 * 60 * 60 * 24 * 7), 'en')).toEqual('1 week ago');
    });

    it('get less than year ago', () => {
      expect(getRelativeTime(-(2 * 1000 * 60 * 60 * 24 * 30), 'en')).toEqual('2 months ago');
    });

    it('more than a year ago', () => {
      expect(getRelativeTime(-(1000 * 60 * 60 * 24 * 366), 'en')).toEqual('1 year ago');
    });
  });
});

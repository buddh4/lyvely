import { CalendarUnitType } from './calendar.interface';

/**
 * This interface needs to be implemented by an adapter usually by wrapping and delegating to an internal date-time instance.
 */
export interface IDateTime {
  /**
   * This flag is used to identify IDateTime instances.
   **/
  isDateTime: boolean;

  /**
   * Transforms this date-time instance to a javascript date object.
   **/
  toDate(): Date;

  /**
   * Returns a cloned IDateTime instance with a specified amount of time subtracted.
   **/
  subtract(value: number, unit?: CalendarUnitType): IDateTime;

  /**
   * Returns a cloned IDateTime instance with a specified amount of time added.
   **/
  add(value: number, unit?: CalendarUnitType): IDateTime;

  /**
   * Returns a IDateTime instance with a flag to use UTC time.
   * @param preserveTime Passing true will change the time zone without changing the current time.
   **/
  utc(preserveTime?: boolean): IDateTime;

  /**
   * Get the date of the month.
   *
   * Returns numbers from 1 to 31.
   */
  date(): number;
  /**
   * Set the date of the month.
   *
   * Accepts numbers from 1 to 31. If the range is exceeded, it will bubble up to the next months.
   */
  date(value: number): IDateTime;

  /**
   * Get the day of the week.
   *
   * Returns numbers from 0 (Sunday) to 6 (Saturday).
   */
  day(): number;

  /**
   * Set the day of the week.
   *
   * Accepts numbers from 0 (Sunday) to 6 (Saturday). If the range is exceeded, it will bubble up to next weeks.
   */
  day(value: number): IDateTime;

  /**
   * Gets locale aware day of the week.
   */
  weekday(): number;

  /**
   * Sets locale aware day of the week.
   */
  weekday(value: number): IDateTime;

  /**
   * Gets the week of the year.
   */
  week(): number;

  /**
   * Sets the week of the year.
   */
  week(value: number): IDateTime;

  /**
   * Get ISO day of the week.
   */
  isoWeek(): number;

  /**
   * Set ISO day of the week.
   */
  isoWeek(value: number): IDateTime;

  /**
   * Get ISO day of the week and.
   */
  isoWeekday(): number;

  /**
   * Set ISO day of the week and.
   */
  isoWeekday(value: number): IDateTime;

  /**
   * Get ISO week-year.
   */
  isoWeekYear(): number;

  /**
   * Get locale aware week of the year.
   */
  weekYear(): number;

  /**
   * Gets the quarter.
   */
  quarter(): number;

  /**
   * Sets the quarter.
   */
  quarter(value: number): IDateTime;

  /**
   * Gets the month.
   * Returns numbers from 0 to 11.
   */
  month(): number;

  /**
   * Sets the month.
   * Accepts numbers from 0 to 11. If the range is exceeded, it will bubble up to the year.
   * @param value
   */
  month(value: number): IDateTime;

  /**
   * Gets the year.
   */
  year(): number;

  /**
   * Sets the year.
   */
  year(value: number): IDateTime;

  /**
   * Sets the time while using 0 as default for each parameter.
   * @param h the hour value
   * @param m the minute value
   * @param s the second value
   * @param ms the millisecond value
   */
  time(h?: number, m?: number, s?: number, ms?: number): IDateTime;

  /**
   * Returns the unix timestamp.
   */
  unixTs(): number;

  /**
   * Formats the date with the given template.
   * @param template
   */
  format(template: string): string;
}

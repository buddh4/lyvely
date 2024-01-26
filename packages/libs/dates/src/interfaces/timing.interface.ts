/**
 * The ITiming interface represents the timing information for a certain event.
 * It contains optional properties to represent the specific time period of the event.
 *
 * @interface
 */
export interface ITiming {
  tid: string;
  year?: number;
  quarter?: number;
  month?: number;
  week?: number;
  day?: number;
}

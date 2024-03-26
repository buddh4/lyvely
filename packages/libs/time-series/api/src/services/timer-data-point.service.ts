import {
  DocumentNotFoundException,
  IntegrityException,
  ProtectedProfileContext,
} from '@lyvely/api';
import { CalendarDate } from '@lyvely/dates';
import { isTimerDataPointConfig } from '@lyvely/time-series-interface';
import { DataPointService } from './data-point.service';
import { DataPoint, TimerDataPoint, TimeSeriesContent } from '../schemas';

/**
 * A service responsible for updating data point values supporting a timer.
 */
export abstract class TimerDataPointService<T extends TimeSeriesContent = TimeSeriesContent> {
  /** The data point service, responsible for updating the data point value. **/
  abstract dataPointService: DataPointService<T>;

  /**
   * Starts a timer for the given time series content and date, which will either update or create a new data point.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {T} model - The model for which to start the timer.
   * @param {CalendarDate} date - The date for which to start the timer.
   * @return {Promise<TimerDataPoint>} - The updated timer data point.
   * @throws {IntegrityException} - If the model is not a timer time series or if the data point is not a timer data point.
   */
  async startTimer(
    context: ProtectedProfileContext,
    model: T,
    date: CalendarDate,
  ): Promise<TimerDataPoint> {
    if (!isTimerDataPointConfig(model.timeSeriesConfig))
      throw new IntegrityException('Can not start timer of non timer time series.');

    const { dataPoint } = await this.dataPointService.findOrCreateDataPointByDate(
      context,
      model,
      date,
    );

    if (!this.isTimerDataPoint(dataPoint))
      throw new IntegrityException('Can not start timer of non timer data point.');

    if (dataPoint.isTimerStarted()) return dataPoint;

    dataPoint.startTimer(context.user);

    const { dataPoint: updatedDataPoint } = await this.dataPointService.upsertDataPoint(
      context,
      model,
      date,
      dataPoint.value,
    );

    return updatedDataPoint as TimerDataPoint;
  }

  /**
   * Stops an existing timer for a given time series content on a specific date.
   *
   * @param {ProtectedProfileContext} context - The context of the protected profile.
   * @param {T} model - The model for the data point.
   * @param {CalendarDate} date - The date of the data point.
   * @return {Promise<TimerDataPoint>} - The updated data point with the timer stopped.
   * @throws {IntegrityException} - If the model is not a timer time series or if the data point is not a timer data point.
   */
  async stopTimer(
    context: ProtectedProfileContext,
    model: T,
    date: CalendarDate,
  ): Promise<TimerDataPoint> {
    if (!isTimerDataPointConfig(model.timeSeriesConfig))
      throw new IntegrityException('Can not start timer of non timer time series.');

    const { dataPoint } = await this.dataPointService.findOrCreateDataPointByDate(
      context,
      model,
      date,
    );

    if (!this.isTimerDataPoint(dataPoint))
      throw new IntegrityException('Can not stop timer of non timer data point.');

    if (!dataPoint.isTimerStarted()) return dataPoint;

    dataPoint.stopTimer();

    const { dataPoint: updatedDataPoint } = await this.dataPointService.upsertDataPoint(
      context,
      model,
      date,
      dataPoint.value,
    );

    return updatedDataPoint as TimerDataPoint;
  }

  /**
   * Checks if the given data point is an instance of TimerDataPoint or throws an error if this is not the case.
   *
   * @param {DataPoint} dataPoint - The data point to be checked.
   * @returns {boolean} - Returns true if the data point is an instance of TimerDataPoint, otherwise false.
   * @throws {DocumentNotFoundException} - If the data point is null or undefined.
   * @throws {IntegrityException} - If the data point is not an instance of TimerDataPoint.
   * @private
   */
  private isTimerDataPoint(dataPoint: DataPoint): dataPoint is TimerDataPoint {
    if (!dataPoint) throw new DocumentNotFoundException();
    if (!(dataPoint instanceof TimerDataPoint))
      throw new IntegrityException('Can not start timer of non timer data point.');

    return true;
  }
}

import { expect } from '@jest/globals';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig, TextareaTextDataPointConfig
} from '../schemas';
import { DataPointInputStrategy, DataPointInputType, DataPointValueType, NumberDataPointSettings, CalendarIntervalEnum } from 'lyvely-common';

describe('TimeSeriesDataPointConfigFactory', () => {
  describe('createConfig()', () => {
    it('create checkbox config without settings', async () => {
      const config =
        DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(DataPointInputStrategy.CheckboxNumber);

      expect(config).toBeDefined();
      expect(config instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(DataPointInputStrategy.CheckboxNumber);
      expect(config.inputType).toEqual(DataPointInputType.Checkbox);
      expect(config.valueType).toEqual(DataPointValueType.Number);
      expect(config.min).toBeUndefined();
      expect(config.max).toBeUndefined();
      expect(config.optimal).toBeUndefined();
      expect(config.getSettings().min).toBeUndefined();
      expect(config.getSettings().max).toBeUndefined();
      expect(config.getSettings().optimal).toBeUndefined();
    });

    it('create checkbox config', async () => {
      const settings: NumberDataPointSettings = {
        min: 0,
        max: 2,
        optimal: 1,
        interval: CalendarIntervalEnum.Daily
      };
      const config =
        DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(DataPointInputStrategy.CheckboxNumber, settings);

      expect(config).toBeDefined();
      expect(config instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(DataPointInputStrategy.CheckboxNumber);
      expect(config.inputType).toEqual(DataPointInputType.Checkbox);
      expect(config.valueType).toEqual(DataPointValueType.Number);
      expect(config.min).toEqual(0);
      expect(config.max).toEqual(2);
      expect(config.optimal).toEqual(1);
      expect(config.getSettings().min).toEqual(0);
      expect(config.getSettings().max).toEqual(2);
      expect(config.getSettings().optimal).toEqual(1);
    });

    it('create range config', async () => {
      const settings: NumberDataPointSettings = {
        min: 0,
        max: 2,
        optimal: 1,
        interval: CalendarIntervalEnum.Daily
      };
      const config =
        DataPointConfigFactory.createConfig<RangeNumberDataPointConfig>(DataPointInputStrategy.RangeNumber, settings);

      expect(config).toBeDefined();
      expect(config instanceof RangeNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(DataPointInputStrategy.RangeNumber);
      expect(config.inputType).toEqual(DataPointInputType.Range);
      expect(config.valueType).toEqual(DataPointValueType.Number);
      expect(config.min).toEqual(0);
      expect(config.max).toEqual(2);
      expect(config.optimal).toEqual(1);
      expect(config.getSettings().min).toEqual(0);
      expect(config.getSettings().max).toEqual(2);
      expect(config.getSettings().optimal).toEqual(1);
    });

    it('create spinner config', async () => {
      const settings: NumberDataPointSettings = {
        min: 0,
        max: 2,
        optimal: 1,
        interval: CalendarIntervalEnum.Daily
      };
      const config =
        DataPointConfigFactory.createConfig<RangeNumberDataPointConfig>(DataPointInputStrategy.SpinnerNumber, settings);

      expect(config).toBeDefined();
      expect(config instanceof SpinnerNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(DataPointInputStrategy.SpinnerNumber);
      expect(config.inputType).toEqual(DataPointInputType.Spinner);
      expect(config.valueType).toEqual(DataPointValueType.Number);
      expect(config.min).toEqual(0);
      expect(config.max).toEqual(2);
      expect(config.optimal).toEqual(1);
      expect(config.getSettings().min).toEqual(0);
      expect(config.getSettings().max).toEqual(2);
      expect(config.getSettings().optimal).toEqual(1);
    });

    it('create text config', async () => {
      const config =
        DataPointConfigFactory.createConfig<TextareaTextDataPointConfig>(DataPointInputStrategy.TextareaText);

      expect(config).toBeDefined();
      expect(config instanceof TextareaTextDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(DataPointInputStrategy.TextareaText);
      expect(config.inputType).toEqual(DataPointInputType.Textarea);
      expect(config.valueType).toEqual(DataPointValueType.Text);
      expect(config.getSettings()).toBeUndefined();
    });
  });
});

import { expect } from '@jest/globals';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberDataPointConfig,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TextareaTextDataPointConfig,
} from '@/time-series';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointSettings,
  CalendarIntervalEnum,
} from '@lyvely/common';

const CheckboxNumberStrategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Checkbox,
);

describe('TimeSeriesDataPointConfigFactory', () => {
  describe('createConfig()', () => {
    it('create checkbox config without settings', async () => {
      const config = DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
        DataPointValueType.Number,
        DataPointInputType.Checkbox,
      );

      expect(config).toBeDefined();
      expect(config instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(CheckboxNumberStrategy);
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
      const settings: INumberDataPointSettings = {
        min: 0,
        max: 2,
        optimal: 1,
        interval: CalendarIntervalEnum.Daily,
      };
      const config = DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
        DataPointValueType.Number,
        DataPointInputType.Checkbox,
        settings,
      );

      expectConfig(config, 0, 2, 1);
      expect(config instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(CheckboxNumberStrategy);
      expect(config.inputType).toEqual(DataPointInputType.Checkbox);
      expect(config.valueType).toEqual(DataPointValueType.Number);
    });

    it('create range config', async () => {
      const settings: INumberDataPointSettings = {
        min: 0,
        max: 2,
        optimal: 1,
        interval: CalendarIntervalEnum.Daily,
      };
      const config = DataPointConfigFactory.createConfig<RangeNumberDataPointConfig>(
        DataPointValueType.Number,
        DataPointInputType.Range,
        settings,
      );

      expectConfig(config, 0, 2, 1);
      expect(config.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Range),
      );
      expect(config.inputType).toEqual(DataPointInputType.Range);
      expect(config.valueType).toEqual(DataPointValueType.Number);
    });

    it('create spinner config', async () => {
      const settings: INumberDataPointSettings = {
        min: 0,
        max: 2,
        optimal: 1,
        interval: CalendarIntervalEnum.Daily,
      };
      const config = DataPointConfigFactory.createConfig<SpinnerNumberDataPointConfig>(
        DataPointValueType.Number,
        DataPointInputType.Spinner,
        settings,
      );

      expectConfig(config, 0, 2, 1);
      expect(config instanceof SpinnerNumberDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(
          DataPointValueType.Number,
          DataPointInputType.Spinner,
        ),
      );
      expect(config.inputType).toEqual(DataPointInputType.Spinner);
      expect(config.valueType).toEqual(DataPointValueType.Number);
    });

    it('create text config', async () => {
      const config = DataPointConfigFactory.createConfig<TextareaTextDataPointConfig>(
        DataPointValueType.Text,
        DataPointInputType.Textarea,
      );

      expect(config).toBeDefined();
      expect(config instanceof TextareaTextDataPointConfig).toEqual(true);
      expect(config.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(
          DataPointValueType.Text,
          DataPointInputType.Textarea,
        ),
      );
      expect(config.inputType).toEqual(DataPointInputType.Textarea);
      expect(config.valueType).toEqual(DataPointValueType.Text);
      expect(config.getSettings()).toEqual({});
    });

    function expectConfig(
      config: NumberDataPointConfig,
      min: number,
      max: number,
      optimal: number,
    ) {
      expect(config instanceof NumberDataPointConfig).toEqual(true);
      expect(config.min).toEqual(min);
      expect(config.max).toEqual(max);
      expect(config.optimal).toEqual(optimal);
      expect(config.getSettings().min).toEqual(min);
      expect(config.getSettings().max).toEqual(max);
      expect(config.getSettings().optimal).toEqual(optimal);
    }
  });
});

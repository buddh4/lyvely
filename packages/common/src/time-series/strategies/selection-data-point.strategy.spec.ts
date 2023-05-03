import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointConfig,
  ISelectionDataPointValue,
  SELECTION_OTHER_OPTION_KEY,
  SelectionDataPointModel,
  useDataPointStrategyFacade,
} from '@/time-series';
import { CalendarInterval, isToday } from '@/calendar';
import { toTimingId } from '@/calendar-plan';

describe('SelectionDataPointStrategy', () => {
  describe('validateValue', () => {
    it('selection undefined should fail', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {},
        ),
      ).toEqual(false);
    });

    it('invalid value type should fail', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          3,
        ),
      ).toEqual(false);
    });

    it('single valid checkbox selection', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual(true);
    });

    it('multiple valid checkbox selection', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', 'Option 2'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual(true);
    });

    it('empty checkbox selection should be accepted', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: [],
          } as ISelectionDataPointValue,
        ),
      ).toEqual(true);
    });

    it('other checkbox value accepted', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            allowOther: true,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: [SELECTION_OTHER_OPTION_KEY],
            otherValue: 'Other Option',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(true);
    });

    it('empty other value should fail', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            allowOther: true,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: [SELECTION_OTHER_OPTION_KEY],
            otherValue: ' ',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });

    it('other value and option checkbox value accepted', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            allowOther: true,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', SELECTION_OTHER_OPTION_KEY],
            otherValue: 'Other Option',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(true);
    });

    it('other option disabled', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            allowOther: false,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: [SELECTION_OTHER_OPTION_KEY],
            otherValue: 'Other Option',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });

    it('other value and option not allowed', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            allowOther: false,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', SELECTION_OTHER_OPTION_KEY],
            otherValue: 'Other Option',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });

    it('invalid option should fail', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Does not exist'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });

    it('radio does not accept multiple values', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Radio,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', 'Option 2'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });

    it('radio does accept other values', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Radio,
            options: ['Option 1', 'Option 2'],
            allowOther: true,
          } as ISelectionDataPointConfig,
          {
            selection: [SELECTION_OTHER_OPTION_KEY],
            otherValue: 'Test',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(true);
    });

    it('dropdown does not accept multiple values', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Dropdown,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', 'Option 2'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });

    it('dropdown does not accept otherValue', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Dropdown,
            options: ['Option 1', 'Option 2'],
            allowOther: true,
          } as ISelectionDataPointConfig,
          {
            selection: [SELECTION_OTHER_OPTION_KEY],
            otherValue: 'Test',
          } as ISelectionDataPointValue,
        ),
      ).toEqual(false);
    });
  });

  describe('prepareValue', () => {
    it('filter out non existing options', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', 'Does not exist'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual({ selection: ['Option 1'] });
    });

    it('accept other value if allowed', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
            allowOther: true,
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', SELECTION_OTHER_OPTION_KEY],
          } as ISelectionDataPointValue,
        ),
      ).toEqual({ selection: ['Option 1', SELECTION_OTHER_OPTION_KEY] });
    });

    it('filter out other value if disabled', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Checkbox,
            options: ['Option 1', 'Option 2'],
            allowOther: false,
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', SELECTION_OTHER_OPTION_KEY],
          } as ISelectionDataPointValue,
        ),
      ).toEqual({ selection: ['Option 1'] });
    });

    it('filter out multi value selection if dropdown', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Dropdown,
            options: ['Option 1', 'Option 2'],
            allowOther: false,
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', 'Option 2'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual({ selection: ['Option 1'] });
    });

    it('filter out multi value selection if radio', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          {
            valueType: DataPointValueType.Selection,
            inputType: DataPointInputType.Radio,
            options: ['Option 1', 'Option 2'],
            allowOther: false,
          } as ISelectionDataPointConfig,
          {
            selection: ['Option 1', 'Option 2'],
          } as ISelectionDataPointValue,
        ),
      ).toEqual({ selection: ['Option 1'] });
    });
  });

  describe('prepareConfig', () => {
    it('assure dropdown input type disables other value', () => {
      const config = {
        valueType: DataPointValueType.Selection,
        inputType: DataPointInputType.Dropdown,
        allowOther: true,
      } as ISelectionDataPointConfig;
      useDataPointStrategyFacade().prepareConfig(config);
      expect(config.allowOther).toEqual(false);
    });
  });

  describe('createDataPoint', () => {
    it('create selection data point', () => {
      const tid = toTimingId(new Date());
      const dataPoint = useDataPointStrategyFacade().createDataPoint({
        id: 'dt1',
        cid: '1',
        tid,
        valueType: DataPointValueType.Selection,
        value: {
          selection: ['Option 1', SELECTION_OTHER_OPTION_KEY],
          otherValue: 'Test',
        },
        interval: CalendarInterval.Daily,
        date: new Date(),
      });

      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof SelectionDataPointModel).toEqual(true);
      expect(dataPoint.id).toEqual('dt1');
      expect(dataPoint.cid).toEqual('1');
      expect(dataPoint.tid).toEqual(tid);
      expect(dataPoint.valueType).toEqual(DataPointValueType.Selection);
      expect(dataPoint.value).toEqual({
        selection: ['Option 1', SELECTION_OTHER_OPTION_KEY],
        otherValue: 'Test',
      });
      expect(dataPoint.interval).toEqual(CalendarInterval.Daily);
      expect(isToday(dataPoint.date)).toEqual(true);
    });
  });
});

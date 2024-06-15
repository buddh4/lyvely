import { AbstractDataPointDao, DataPointDao } from '../';
import { TestTimeSeriesContent } from './test-time-series-content.schema';

@DataPointDao({ content: TestTimeSeriesContent })
export class TestDataPointDao extends AbstractDataPointDao {}

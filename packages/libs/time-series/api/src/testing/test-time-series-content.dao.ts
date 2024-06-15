import { Dao } from '@lyvely/api';
import { TimeSeriesContentDao } from '../daos';
import { TestTimeSeriesContent } from './test-time-series-content.schema';

@Dao(TestTimeSeriesContent)
export class TestTimeSeriesContentDao extends TimeSeriesContentDao<TestTimeSeriesContent> {}

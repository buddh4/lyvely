import { TimeSeriesContentDao } from '../daos';
import { TestTimeSeriesContent } from './test-time-series-content.schema';
import { ProfileDao } from '@lyvely/api';

@ProfileDao(TestTimeSeriesContent)
export class TestTimeSeriesContentDao extends TimeSeriesContentDao<TestTimeSeriesContent> {}

import { DataPointDao, AbstractDataPointDao } from '@lyvely/time-series';
import { Journal } from '../schemas';

@DataPointDao({ content: Journal })
export class JournalDataPointDao extends AbstractDataPointDao {}

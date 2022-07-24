import { Exclude } from 'class-transformer';
import { AbstractCreateActivityDto } from './abstract-create-activity.dto';

@Exclude()
export abstract class AbstractEditActivityDto extends AbstractCreateActivityDto {}

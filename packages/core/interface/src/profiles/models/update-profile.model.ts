import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateProfileModel } from './create-profile.model';

@Exclude()
export class UpdateProfileModel extends PartialType(CreateProfileModel) {}

import { AvatarModel } from '../models';

export interface IUpdateAvatarClient {
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

import { AvatarModel } from '../models';

export interface IUpdateAvatarClient {
  updateAvatar(file: any): Promise<AvatarModel>;
}

export interface IUpdateGravatarClient {
  updateGravatar(): Promise<AvatarModel>;
}

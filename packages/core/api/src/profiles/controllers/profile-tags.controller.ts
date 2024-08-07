import { ProfileController } from '../decorators';
import { ProfileTagsService } from '../services';
import {
  Request,
  Param,
  Post,
  Inject,
  ForbiddenException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ProfileRequest } from '../types';
import { assureObjectId, DocumentIdentity, ValidBody } from '@/core';
import {
  UpdateTagModel,
  TagModel,
  CreateTagModel,
  API_PROFILE_TAGS,
  ProfileTagsEndpoint,
  ManageTagsPermission,
} from '@lyvely/interface';
import { Tag } from '../schemas';
import { Permissions } from '@/permissions';

@ProfileController(API_PROFILE_TAGS)
@Permissions(ManageTagsPermission.id)
export class ProfileTagsController implements ProfileTagsEndpoint {
  @Inject()
  private tagService: ProfileTagsService;

  @Post()
  async create(@ValidBody() dto: CreateTagModel, @Request() req: ProfileRequest) {
    const profile = this._getMemberProfile(req);
    await this.tagService.addTag(profile, dto);
    return new TagModel(profile.getTagByName(dto.name)!);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @ValidBody() dto: UpdateTagModel,
    @Request() req: ProfileRequest
  ) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);

    if (!tag) throw new NotFoundException();

    await this.tagService.updateTag(profile, tag, dto);
    return new TagModel(tag);
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string, @Request() req: ProfileRequest) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);
    return await this.tagService.archiveTag(profile, tag);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string, @Request() req: ProfileRequest) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);
    return await this.tagService.restore(profile, tag);
  }

  private _getMemberProfile(req: ProfileRequest) {
    const { profile, context } = req;

    // TODO: Implement ManageTagsPolicy
    if (!context.getMembership()) {
      throw new ForbiddenException();
    }

    return profile;
  }

  private _getTagById(profile, id: DocumentIdentity<Tag>) {
    const tag = profile.getTagById(assureObjectId(id));

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }
}

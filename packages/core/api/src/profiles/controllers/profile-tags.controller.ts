import { ProfileController } from '../decorators';
import { ProfilesService, ProfileTagsService } from '../services';
import {
  Request,
  Param,
  Post,
  Body,
  Inject,
  ForbiddenException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ProfileRequest } from '../types';
import { assureObjectId, EntityIdentity, UseClassSerializer } from '@/core';
import { ServiceException } from '@lyvely/common';
import {
  UpdateTagModel,
  TagModel,
  CreateTagModel,
  ENDPOINT_PROFILE_TAGS,
  ProfileTagsEndpoint,
} from '@lyvely/core-interface';
import { Tag } from '../schemas';

// TODO feature check
@ProfileController(ENDPOINT_PROFILE_TAGS)
@UseClassSerializer()
export class ProfileTagsController implements ProfileTagsEndpoint {
  @Inject()
  private profilesService: ProfilesService;

  @Inject()
  private tagService: ProfileTagsService;

  @Post()
  async create(@Body() dto: CreateTagModel, @Request() req: ProfileRequest) {
    const profile = this._getMemberProfile(req);

    if (!(await this.tagService.addTag(profile, dto))) {
      throw new ServiceException();
    }

    return new TagModel(profile.getTagByName(dto.name));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTagModel,
    @Request() req: ProfileRequest,
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

  @Post(':id/unarchive')
  async unarchive(@Param('id') id: string, @Request() req: ProfileRequest) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);
    return await this.tagService.unarchive(profile, tag);
  }

  private _getMemberProfile(req: ProfileRequest) {
    const { profile, context } = req;

    // TODO: Implement ManageTagsPolicy
    if (!context.getMembership()) {
      throw new ForbiddenException();
    }

    return profile;
  }

  private _getTagById(profile, id: EntityIdentity<Tag>) {
    const tag = profile.getTagById(assureObjectId(id));

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }
}

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
import { UpdateTagDto, TagModel, CreateTagDto, ServiceException } from '@lyvely/common';
import { assureObjectId, EntityIdentity, UseClassSerializer } from '@/core';
import { Tag } from '../../tags';

// TODO feature check
@ProfileController('tags')
@UseClassSerializer()
export class ProfileTagsController {
  @Inject()
  private profilesService: ProfilesService;

  @Inject()
  private tagService: ProfileTagsService;

  @Post()
  async create(@Request() req: ProfileRequest, @Body() dto: CreateTagDto) {
    const profile = this._getMemberProfile(req);

    if (!(await this.tagService.addTag(profile, dto))) {
      throw new ServiceException();
    }

    return new TagModel(profile.getTagByName(dto.name));
  }

  @Put(':id')
  async update(@Request() req: ProfileRequest, @Param('id') id: string, @Body() dto: UpdateTagDto) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);

    if (!tag) throw new NotFoundException();

    await this.tagService.updateTag(profile, tag, dto);
    return new TagModel(tag);
  }

  @Post(':id/archive')
  async archive(@Request() req: ProfileRequest, @Param('id') id: string) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);
    return await this.tagService.archiveTag(profile, tag);
  }

  @Post(':id/unarchive')
  async unArchive(@Request() req: ProfileRequest, @Param('id') id: string) {
    const profile = this._getMemberProfile(req);
    const tag = this._getTagById(profile, id);
    return await this.tagService.unArchiveTag(profile, tag);
  }

  _getMemberProfile(req: ProfileRequest) {
    const { profile, context } = req;

    // TODO: Implement ManageTagsPolicy
    if (!context.getMembership()) {
      throw new ForbiddenException();
    }

    return profile;
  }

  _getTagById(profile, id: EntityIdentity<Tag>) {
    const tag = profile.getTagById(assureObjectId(id));

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }
}

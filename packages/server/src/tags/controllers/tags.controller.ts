import { ProfileController, ProfileDao, ProfilesService } from "../../profiles";
import { UseClassSerializer } from "../../core/decorators/use-class-serializer.decorator";
import {
  Request,
  Param,
  Post,
  Body,
  Inject,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { ProfileRequest } from "../../core/types";
import { EditTagDto, TagDto } from "@lyvely/common";
import { assureObjectId } from "../../db/db.utils";

// TODO feature check
@ProfileController('tags')
@UseClassSerializer()
export class TagsController {

  @Inject()
  private profilesService: ProfilesService;

  @Post(':id')
  async editTag(@Request() req: ProfileRequest, @Param('id') id, @Body() dto: EditTagDto) {
    const { profile, profileRelations } = req;

    // TODO: Implement ManageTagsPolicy
    if(!profileRelations.getMembership()) {
      throw new ForbiddenException();
    }

    const tag = profile.getTagById(assureObjectId(id));

    if(!tag) {
      throw new NotFoundException();
    }

    await this.profilesService.updateTag(profile, tag, dto);
    return new TagDto(tag);
  }

}

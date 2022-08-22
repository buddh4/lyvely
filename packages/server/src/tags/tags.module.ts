import { Module } from '@nestjs/common';
import { TagsController } from "./controllers/tags.controller";
import { ProfilesModule } from "../profiles";
import { CoreModule } from "../core/core.module";
import { PoliciesModule } from "../policies/policies.module";

@Module({
  imports: [
    CoreModule,
    ProfilesModule,
    PoliciesModule,
  ],
  controllers: [
    TagsController
  ]
})
export class TagsModule {}

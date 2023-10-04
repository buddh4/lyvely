import { Module } from '@nestjs/common';
import { InvitationsController } from './controllers/invitations.controller';
import { ProfilesModule } from '@lyvely/profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@lyvely/users';
import {
  SendInvitationsService,
  MailInvitationService,
  InvitationsService,
  UserInvitationsService,
} from './services';
import { InvitationDao, MailInvitationDao, UserInvitationDao } from './daos';
import {
  Invitation,
  UserInvitation,
  InvitationSchema,
  MailInvitation,
  MailInvitationSchema,
  UserInvitationSchema,
} from './schemas';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '@lyvely/notifications';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invitation.name,
        schema: InvitationSchema,
        discriminators: [
          { name: MailInvitation.name, schema: MailInvitationSchema },
          { name: UserInvitation.name, schema: UserInvitationSchema },
        ],
      },
    ]),
    UsersModule,
    ProfilesModule,
    JwtModule,
    NotificationsModule,
  ],
  controllers: [InvitationsController],
  providers: [
    InvitationDao,
    UserInvitationDao,
    MailInvitationDao,
    InvitationsService,
    SendInvitationsService,
    MailInvitationService,
    UserInvitationsService,
  ],
  exports: [InvitationsService],
})
export class InvitationsModule {}

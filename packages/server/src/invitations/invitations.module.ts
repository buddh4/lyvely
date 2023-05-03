import { Module } from '@nestjs/common';
import { InvitationsController } from './controllers/invitations.controller';
import { ProfilesModule } from '../profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users';
import { SendInvitationsService, MailInvitesService } from './services';
import { InvitationDao } from './daos';
import {
  Invitation,
  UserInvitation,
  InvitationSchema,
  MailInvitation,
  MailInvitationSchema,
  UserInvitationSchema,
} from './schemas';
import { JwtModule } from '@nestjs/jwt';
import { InvitationsService } from '@/invitations/services/invitations.service';

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
  ],
  controllers: [InvitationsController],
  providers: [InvitationDao, InvitationsService, SendInvitationsService, MailInvitesService],
  exports: [],
})
export class InvitationsModule {}

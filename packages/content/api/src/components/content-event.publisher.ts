import { Injectable } from '@nestjs/common';
import { Content, ContentDocument } from '../schemas';
import { ConfigService } from '@nestjs/config';
import { LiveService } from '@lyvely/live';
import { assureStringId, ConfigurationPath } from '@lyvely/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeStreamInsertDocument } from 'mongodb';
import { ContentUpdateStateLiveEvent } from '@lyvely/content-interface';

@Injectable()
export class ContentEventPublisher {
  private emitCreateEvents: boolean;

  constructor(
    private readonly configService: ConfigService<ConfigurationPath>,
    private readonly liveService: LiveService,
    @InjectModel(Content.name) private readonly contentModel: Model<ContentDocument>,
  ) {
    if (configService.get('mongodb.replicaSet')) {
      const changeStream = contentModel.watch([{ $match: { operationType: 'insert' } }]);
      changeStream.on('change', (doc: ChangeStreamInsertDocument<ContentDocument>) => {
        /* liveService.emit(LIVE_EVENT_CONTENT_NEW, {
          id: assureStringId(doc.fullDocument._id),
          type: doc.fullDocument.type,
        });*/
        this.emitCreateEvents = false;
      });
    } else {
      this.emitCreateEvents = true;
    }
  }

  emitContentCreated(content: Content) {
    if (this.emitCreateEvents) {
      this.emitContentUpdated(content);
    }
  }

  emitContentUpdated(content: Content) {
    this.liveService.emitProfileEvent(
      new ContentUpdateStateLiveEvent({
        updatesAvailable: true,
        pid: assureStringId(content.pid),
        parentId: content.getParentId() ? assureStringId(content.getParentId()) : undefined,
        streamSort: content.meta.streamSort,
        cid: content.id,
      }),
    );
  }
}

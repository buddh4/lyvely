import { Injectable } from '@nestjs/common';
import { Content, ContentType } from '../schemas';
import { LiveService } from '@/live/services';
import { Model } from '@/core';
import { InjectModel } from '@nestjs/mongoose';
import { ContentUpdateStateLiveEvent } from '@lyvely/interface';
import { LyvelyConfigService } from '@/config';

@Injectable()
export class ContentEventPublisher {
  private emitCreateEvents: boolean;

  constructor(
    private readonly configService: LyvelyConfigService,
    private readonly liveService: LiveService,
    @InjectModel(Content.name) private readonly contentModel: Model<Content>
  ) {
    /*if (configService.get('mongodb.replicaSet')) {
      const changeStream = contentModel.watch([{ $match: { operationType: 'insert' } }]);
      changeStream.on('change', (doc: ChangeStreamInsertDocument<Content>) => {
        * liveService.emit(LIVE_EVENT_CONTENT_NEW, {
          id: assureStringId(doc.fullDocument._id),
          type: doc.fullDocument.type,
        });*
        this.emitCreateEvents = false;
      });
    } else {
      this.emitCreateEvents = true;
    }*/
    this.emitCreateEvents = true;
  }

  emitContentCreated(content: Content) {
    if (this.emitCreateEvents) {
      this.emitContentUpdated(content);
    }
  }

  emitContentUpdated(content: ContentType) {
    this.liveService.emitProfileEvent(
      new ContentUpdateStateLiveEvent(content.toModel(), {
        updatesAvailable: true,
      })
    );
  }
}

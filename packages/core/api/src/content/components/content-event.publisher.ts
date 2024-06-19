import { Injectable } from '@nestjs/common';
import { Content } from '../schemas';
import { LiveService } from '@/live';
import { assureStringId, Model } from '@/core';
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

  emitContentUpdated(content: Content) {
    this.liveService.emitProfileEvent(
      new ContentUpdateStateLiveEvent({
        updatesAvailable: true,
        pid: assureStringId(content.pid),
        parentId: content.getParentId() ? assureStringId(content.getParentId()) : undefined,
        streamSort: content.meta.streamSort,
        cid: content.id,
      })
    );
  }
}

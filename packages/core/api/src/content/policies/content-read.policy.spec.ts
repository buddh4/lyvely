import { LyvelyTestingModule } from '@/testing';
import { Content, ContentSchema, ProfileContentContext } from '../schemas';
import { buildContentTest, TestContent, TestContentSchema } from '../testing';
import { ProfileTestDataUtils } from '@/profiles';
import { RoleVisibilityLevel } from '@lyvely/interface';
import { getPolicyToken, IPolicy } from '@/policies';
import { BaseContentReadPolicy } from './base-content-read.policy';
import { Type } from '@lyvely/common';
import { LyvelyModule } from '@/core';
import { ContentReadPolicy } from './content-read.policy';

class TestContentReadPolicy extends BaseContentReadPolicy {
  override async verify(context: ProfileContentContext<any>): Promise<boolean> {
    return context.content.value === 'test';
  }
}

@LyvelyModule({
  id: 'test',
  name: 'Test',
  path: __dirname,
  policies: [TestContentReadPolicy, ContentReadPolicy],
})
class TestModule {}

describe('ContentReadPolicy', () => {
  let testingModule: LyvelyTestingModule;
  let readPolicy: ContentReadPolicy;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'content_dao';

  const ContentModel = [
    {
      name: Content.name,
      collection: Content.collectionName(),
      schema: ContentSchema,
      discriminators: [{ name: TestContent.name, schema: TestContentSchema }],
    },
  ];

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .imports([TestModule])
      .models(ContentModel)
      .compile();

    readPolicy = testingModule.get(getPolicyToken(ContentReadPolicy));
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('test custom content read policy', async () => {
    class TestContent extends Content {
      value: string;
      override getReadPolicy(): Type<IPolicy<ProfileContentContext>> {
        // This policy only grants read access if value === 'test'
        return TestContentReadPolicy;
      }
    }

    const { owner, profile, memberContext } = await testData.createSimpleGroup();

    const content1 = new TestContent(profile, owner, <any>{ value: 'shouldFail' });
    const content2 = new TestContent(profile, owner, <any>{ value: 'test' });

    (<ProfileContentContext>memberContext).content = content1;

    expect(await readPolicy.verify(memberContext as ProfileContentContext)).toEqual(false);

    (<ProfileContentContext>memberContext).content = content2;

    expect(await readPolicy.verify(memberContext as ProfileContentContext)).toEqual(true);
  });

  it('test profile owner can read content', async () => {
    class TestContent extends Content {
      value: string;
    }

    const { user, profile, context } = await testData.createUserAndProfile();

    const content = new TestContent(profile, user);
    content.meta.visibility = RoleVisibilityLevel.Owner;

    (<ProfileContentContext>context).content = content;

    expect(await readPolicy.verify(context as ProfileContentContext)).toEqual(true);
  });

  it('test profile member can not read content with visibility level owner', async () => {
    class TestContent extends Content {
      value: string;
    }

    const { owner, memberContext, profile } = await testData.createSimpleGroup();

    const content = new TestContent(profile, owner);
    content.meta.visibility = RoleVisibilityLevel.Owner;

    (<ProfileContentContext>memberContext).content = content;

    expect(await readPolicy.verify(memberContext as ProfileContentContext)).toEqual(false);
  });
});

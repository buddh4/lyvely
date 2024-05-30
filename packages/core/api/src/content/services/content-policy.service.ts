import { Injectable } from '@nestjs/common';
import { Content, ProfileContentContext } from '../schemas';
import {
  ContentDeletePolicy,
  ContentManagePolicy,
  ContentReadPolicy,
  ContentWritePolicy,
} from '@/content';
import { InjectPolicy } from '@/policies';
import { ProfileContext } from '@/profiles';

@Injectable()
export class ContentPolicyService {
  constructor(
    @InjectPolicy(ContentWritePolicy.name)
    protected contentWritePolicy: ContentWritePolicy,

    @InjectPolicy(ContentReadPolicy.name)
    protected contentReadPolicy: ContentReadPolicy,

    @InjectPolicy(ContentDeletePolicy.name)
    protected contentDeletePolicy: ContentDeletePolicy,

    @InjectPolicy(ContentManagePolicy.name)
    protected contentManagePolicy: ContentManagePolicy
  ) {}

  /**
   * Populates content policies for the given content and context.
   *
   * @param {ProfileContext} context - The context in which the content policies are populated.
   * @param {Content|Content[]} content - The content or an array of content to populate the policies for.
   *
   * @return {Promise<void>} - A promise that resolves when the content policies have been populated.
   */
  async populateContentPolicies(context: ProfileContext, content: Content | Content[]) {
    content = Array.isArray(content) ? content : [content];
    await Promise.all(content.map((c) => this._populateContentPolicies(context, c)));
  }

  /**
   * Populates the content policies for the given content and profile context.
   *
   * @param {ProfileContext} context - The profile context to use for policy checking.
   * @param {Content} content - The content for which to populate the policies.
   * @return {Promise<void>} A Promise that resolves once the content policies are populated.
   */
  private async _populateContentPolicies(context: ProfileContext, content: Content) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });

    const [canRead, canWrite, canManage, canDelete] = await Promise.all([
      this.canRead(contentContext, content),
      this.canWrite(contentContext, content),
      this.canManage(contentContext, content),
      this.canDelete(contentContext, content),
    ]);

    content.policies = {
      ...content.policies,
      canRead,
      canWrite,
      canManage,
      canDelete,
    };
  }

  /**
   * Checks if the given content can be read in the specified context.
   *
   * @param {Content} content - The content to be checked.
   * @param {ProfileContext} context - The context used for the check.
   *
   * @return {Promise<boolean>} - Returns a Promise that resolves to true if the content can be read by the context,
   *                             and false otherwise.
   */
  async canRead(context: ProfileContext | ProfileContentContext, content: Content) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentReadPolicy.verify(contentContext);
  }

  /**
   * Checks if the given content can be written in the specified context.
   *
   * @param {Content} content - The content to check.
   * @param {ProfileContext} context - The context containing information about the user.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the user can write the content, otherwise `false`.
   */
  async canWrite(context: ProfileContext | ProfileContentContext, content: Content) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentWritePolicy.verify(contentContext);
  }

  /**
   * Checks if the given content can be managed in the specified context.
   *
   * @param {Content} content - The content to check.
   * @param {ProfileContext} context - The context containing information about the user.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the user can write the content, otherwise `false`.
   */
  async canManage(context: ProfileContext | ProfileContentContext, content: Content) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentManagePolicy.verify(contentContext);
  }

  /**
   * Checks if the given content can be deleted in the specified context.
   *
   * @param {Content} content - The content to check.
   * @param {ProfileContext} context - The context containing information about the user.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the user can write the content, otherwise `false`.
   */
  async canDelete(context: ProfileContext | ProfileContentContext, content: Content) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentDeletePolicy.verify(contentContext);
  }
}

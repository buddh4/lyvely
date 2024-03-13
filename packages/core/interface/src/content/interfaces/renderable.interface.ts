export enum RenderableType {
  text = 'text',
  translation = 'translation',
  markdown = 'markdown',
}

export interface IRenderable {
  renderType: string;
}

export type RenderableText = {
  renderType: RenderableType.text;
  text?: string;
};

export type RenderableTranslation = {
  renderType: RenderableType.translation;
  text?: string;
};

export type RenderableMarkdown = {
  renderType: RenderableType.markdown;
  text?: string;
};

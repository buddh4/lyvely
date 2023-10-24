export interface IRenderable {
  renderType: string;
}

export type RenderableText = {
  renderType: 'text';
  text?: string;
};

export type RenderableMarkdown = {
  renderType: 'markdown';
  text?: string;
};

import markdownit from 'markdown-it';

export const MARKDOWN_PRESET_DEFAULT = 'default';

const presets: Map<string, markdownit> = new Map();

presets.set(
  MARKDOWN_PRESET_DEFAULT,
  markdownit({
    html: false,
    linkify: true,
    typographer: true,
  })
);

export const renderMarkdown = (text: string, preset = MARKDOWN_PRESET_DEFAULT): string => {
  const md = presets.get(preset);
  if (!md) throw new Error(`Markdown preset ${preset} not registered.`);
  return md.render(text);
};

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

export async function updateMarkdownTaskListItem(
  markdownText: string,
  position: [number, number],
  checked: boolean
): Promise<string> {
  const unified = (await dynamicImport('unified')).unified;
  const parse = (await dynamicImport('remark-parse')).default;
  const gfm = (await dynamicImport('remark-gfm')).default;
  const stringify = (await dynamicImport('remark-stringify')).default;
  const visit = (await dynamicImport('unist-util-visit')).visit;

  const tree = unified().use(parse).use(gfm).parse(markdownText);

  const [listIndex, itemIndex] = position;

  let currentListIndex = -1;
  let currentItemIndex = -1;

  visit(tree, 'list', (node) => {
    currentListIndex++;
    if (currentListIndex === listIndex) {
      currentItemIndex = -1;
      node.children.forEach((item) => {
        if (item.type !== 'listItem') return;
        currentItemIndex++;
        if (currentItemIndex === itemIndex) {
          item.checked = checked;
        }
      });
    }
  });

  return (
    unified()
      .use(gfm)
      // https://github.com/remarkjs/remark/blob/main/packages/remark-stringify/readme.md
      .use(stringify, {
        bullet: '-',
      })
      .stringify(tree)
  );
}

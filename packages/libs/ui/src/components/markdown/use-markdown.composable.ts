import markdownit from 'markdown-it';
import { tasklist } from '@mdit/plugin-tasklist';
import { findDfi, findFirst, findParent, getElementIndex } from '@/helpers';

export const MARKDOWN_PRESET_DEFAULT_EDITABLE = 'default_editable';
export const MARKDOWN_PRESET_DEFAULT = 'default';
export const MARKDOWN_TASK_LIST_ITEM_CLASS = 'md-task-list-item';
export const MARKDOWN_TASK_LIST_ITEM_CHECKBOX_CLASS = 'md-task-list-item-checkbox';
export const MARKDOWN_VIEW_CLASS = 'md-view';

const presets: Map<string, markdownit> = new Map();

presets.set(
  MARKDOWN_PRESET_DEFAULT,
  markdownit({
    html: false,
    linkify: true,
    typographer: true,
  }).use(tasklist, {
    itemClass: MARKDOWN_TASK_LIST_ITEM_CLASS,
    checkboxClass: MARKDOWN_TASK_LIST_ITEM_CHECKBOX_CLASS,
  })
);

presets.set(
  MARKDOWN_PRESET_DEFAULT_EDITABLE,
  markdownit({
    html: false,
    linkify: true,
    typographer: true,
  }).use(tasklist, {
    disabled: false,
    itemClass: MARKDOWN_TASK_LIST_ITEM_CLASS,
    checkboxClass: MARKDOWN_TASK_LIST_ITEM_CHECKBOX_CLASS,
  })
);

export interface TaskListClickEvent {
  position: [number, number];
  checked: boolean;
}

const addTaskListHandler = (elem: HTMLElement, handler: (evt: TaskListClickEvent) => void) => {
  elem.querySelectorAll(`.${MARKDOWN_TASK_LIST_ITEM_CLASS}`).forEach((checklistItem) => {
    checklistItem.addEventListener('click', (evt) => {
      if (!evt.target) throw new Error('No event target found.');
      const target = evt.target as HTMLElement;
      const position = getTaskListItemPosition(target);
      const checkbox = findFirst(
        target,
        `.${MARKDOWN_TASK_LIST_ITEM_CHECKBOX_CLASS}`
      ) as HTMLInputElement;
      if (!checkbox) throw new Error('No task list checkbox found.');
      handler({ position, checked: checkbox.checked });
    });
  });
};

const getTaskListItemPosition = (elem: HTMLElement): [number, number] => {
  const listItem = findParent(elem, `.${MARKDOWN_TASK_LIST_ITEM_CLASS}`);
  if (!listItem) throw new Error('Invalid task list click event');
  const itemIndex = getElementIndex(listItem);
  const root = findParent(listItem, `.${MARKDOWN_VIEW_CLASS}`);
  if (!root) throw new Error('Could not find markdown root');
  const listIndex = findDfi(root, listItem, 'ul, ol');
  return [listIndex, itemIndex];
};

export const renderDefaultMarkdown = (
  text: string,
  editable = false
): { html: string; addTaskListHandler: typeof addTaskListHandler } => {
  return renderMarkdown(
    text,
    editable ? MARKDOWN_PRESET_DEFAULT_EDITABLE : MARKDOWN_PRESET_DEFAULT
  );
};

export const renderMarkdown = (
  text: string,
  preset = MARKDOWN_PRESET_DEFAULT
): { html: string; addTaskListHandler: typeof addTaskListHandler } => {
  const md = presets.get(preset);
  if (!md) throw new Error(`Markdown preset ${preset} not registered.`);
  return { html: md.render(text), addTaskListHandler: addTaskListHandler };
};

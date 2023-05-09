<script lang="ts" setup>
import LyModal from '@/modules/ui/components/modal/ModalWindow.vue';
import { computed, nextTick, ref, watch } from 'vue';
import LyInputText from '@/modules/ui/components/form/TextInput.vue';
import FloatingInputLayout from '@/modules/ui/components/form/FloatingInputLayout.vue';
import { escapeRegExp, isArray, uniqueId } from 'lodash';
import LyBadge from '@/modules/ui/components/badge/BadgeText.vue';

export type IChooserOption = { key: string; value?: any; label?: string; color?: string } | string;

export interface IProps {
  modelValue: Array<string>;
  options: Array<IChooserOption>;
  labels?: Record<string, string> | ((key: string) => string);
  add: boolean;
  multiple?: boolean;
  addTextKey?: string;
  inputId?: string;
  label: string;
}

const props = withDefaults(defineProps<IProps>(), {
  inputId: uniqueId('tag-chooser'),
  labels: undefined,
  add: false,
  multiple: true,
  addTextKey: 'common.add_option',
});

const emit = defineEmits(['update:modelValue', 'update:visible']);

const query = ref('');
const visible = ref(false);
const chooser = ref<HTMLElement>();

watch(visible, () => (query.value = ''));

const optionsToAdd = computed(
  () =>
    props.options.filter((option) => !isSelected(getOptionKey(option)) && filterOption(option)) ||
    [],
);

function getOptionKey(option: IChooserOption): string {
  return typeof option === 'string' ? option : option.key;
}

function getLabel(option: IChooserOption): string {
  let result;

  const key = getOptionKey(option);

  if (typeof props.labels === 'function') {
    result = props.labels(key);
  } else if (props.labels) {
    result = props.labels[key];
  }

  if (typeof option !== 'object') return option;
  if (!result && option.label) result = option.label;
  if (!result && typeof option.value === 'string') result = option.value;
  if (!result) result = option.key;
  return result;
}

function filterOption(option?: IChooserOption) {
  return (
    option && (!query.value || getLabel(option).match(new RegExp(escapeRegExp(query.value), 'i')))
  );
}

function getOption(key: string): IChooserOption | undefined {
  return props.options.find((option) => getOptionKey(option) === key) || key;
}
const model = computed(() => (isArray(props.modelValue) ? props.modelValue : []));
const selection = computed(() => model.value.map(getOption));

const selectedOptions = computed(
  () =>
    model.value.map((key: string) => getOption(key)).filter(filterOption) as Array<IChooserOption>,
);

function addSelection(option: IChooserOption) {
  if (isSelected(option)) return;
  query.value = '';
  const newValue = props.multiple ? [...model.value, getOptionKey(option)] : [getOptionKey(option)];
  emit('update:modelValue', newValue);
  focusOption(option);
}

function removeSelection(option: IChooserOption) {
  query.value = '';
  emit(
    'update:modelValue',
    model.value.filter((key) => getOptionKey(option) !== key),
  );
  focusOption(option);
}

function focusOption(option: IChooserOption) {
  const optionKey = getOptionKey(option);
  nextTick(() => {
    const entry = chooser.value?.querySelector(
      `[data-badge-selection="${optionKey}"]`,
    ) as HTMLElement;
    if (entry) entry.focus();
  });
}

function isSelected(option: IChooserOption) {
  return model.value.includes(getOptionKey(option));
}

function isExistingOption(key: string) {
  return !!optionsToAdd.value.find((option) => getOptionKey(option) === key);
}

function focusFirst() {
  const entry = chooser.value?.querySelector('[data-badge-selection]') as HTMLElement;
  if (entry) entry.focus();
}

function focusNext(evt: KeyboardEvent) {
  const next = (<HTMLElement>evt.target).nextElementSibling as HTMLElement | null;
  if (next) next.focus();
  else (<HTMLElement>document.querySelector('#badge-chooser-search'))?.focus();
}

function focusPrev(evt: KeyboardEvent) {
  const prev = (<HTMLElement>evt.target).previousElementSibling as HTMLElement | null;
  if (prev) prev.focus();
  else (<HTMLElement>document.querySelector('#badge-chooser-search'))?.focus();
}

const entryClass =
  'flex items-center gap-2 border-divide bg-main p-2 md:p-4 cursor-pointer p-2 md:p-4 focus:outline-none hover:bg-highlight focus:bg-highlight';

function getBadgeClass(option: IChooserOption) {
  return [
    'mr-0.5 border',
    { 'border-transparent': !!getColor(option) },
    { 'bg-primary': !getColor(option) },
    { 'border-divide': !getColor(option) },
  ];
}

function getColor(option: IChooserOption) {
  return typeof option === 'object' ? option.color : undefined;
}

const showAddEntry = computed(
  () => props.add && query.value.length && !isExistingOption(query.value),
);
const showEmptyEntry = computed(() => !showAddEntry.value && !props.options.length);
</script>

<template>
  <floating-input-layout
    tabindex="0"
    :input-id="inputId"
    class="floating-input cursor-pointer h-auto"
    :label="label"
    @click="visible = true"
    @keyup.enter.prevent="visible = true">
    <div class="flex pt-2">
      <template v-for="option in selection" :key="getOptionKey(option)">
        <ly-badge
          v-if="option"
          :text="getLabel(option)"
          :color="getColor(option)"
          :class="getBadgeClass(option)" />
      </template>
    </div>
  </floating-input-layout>
  <ly-modal
    v-model="visible"
    :title="label"
    :cancel-button="false"
    submit-button-text="common.select"
    submit-icon="check"
    @submit="visible = false">
    <div ref="chooser" class="flex flex-col">
      <div>
        <ly-input-text
          id="badge-chooser-search"
          v-model="query"
          :autofocus="true"
          :placeholder="$t('common.filter.search')"
          input-class="attachment-b"
          @keyup.down="focusFirst" />
      </div>

      <div class="flex flex-col border border-divide divide-y rounded-b">
        <div
          v-for="option in selectedOptions"
          :key="getOptionKey(option)"
          :data-badge-selection="getOptionKey(option)"
          :class="entryClass"
          tabindex="0"
          @click="removeSelection(option)"
          @keyup.enter.prevent.stop="removeSelection(option)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <ly-button
            tabindex="-1"
            aria-hidden="true"
            class="w-5 h-5 bg-main border border-divide rounded-full flex justify-center items-center text-sm px-0 py-0"
            ><span class="text-primary text-xs">x</span></ly-button
          >
          <ly-badge
            :text="getLabel(option)"
            :color="getColor(option)"
            :class="getBadgeClass(option)" />
        </div>

        <div
          v-for="option in optionsToAdd"
          :key="getOptionKey(option)"
          :data-badge-selection="getOptionKey(option)"
          :class="entryClass"
          tabindex="0"
          @click="addSelection(option)"
          @keyup.enter.prevent.stop="addSelection(option)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <ly-badge
            :text="getLabel(option)"
            :color="getColor(option)"
            :class="getBadgeClass(option)" />
        </div>
        <div
          v-if="showAddEntry"
          data-badge-selection
          :class="[entryClass]"
          tabindex="0"
          @click="addSelection(query)"
          @keyup.enter.prevent.stop="addSelection(query)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <i18n-t :keypath="addTextKey" tag="span" class="text-center text-dimmed text-sm">
            <template #option>
              <b>{{ query }}</b>
            </template>
          </i18n-t>
        </div>
        <div
          v-if="showEmptyEntry"
          data-badge-selection
          class="flex items-center gap-2 border-divide bg-main p-2 md:p-4 p-2 md:p-4">
          <span v-if="query">{{ $t('common.empty_result_filter') }}</span>
          <span v-else>{{ $t('common.empty_result') }}</span>
        </div>
      </div>
    </div>
  </ly-modal>
</template>

<style scoped>
[data-badge-selection]:last-of-type {
  @apply rounded-b;
}
</style>

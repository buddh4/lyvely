<script lang="ts" setup>
import LyModal from '@/modules/ui/components/modal/ModalWindow.vue';
import { computed, ref, watch } from 'vue';
import LyInputText from '@/modules/ui/components/form/TextInput.vue';
import FloatingInputLayout from '@/modules/ui/components/form/FloatingInputLayout.vue';
import { escapeRegExp, uniqueId } from 'lodash';
import { translate } from '@/i18n';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { TagModel } from '@lyvely/common';

const profileStore = useProfileStore();

export interface IProps {
  modelValue: Array<string>;
  title?: string;
  inputId?: string;
  label?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'tags.chooser.title',
  inputId: uniqueId('tag-chooser'),
  label: translate('tags.chooser.label'),
});

const emit = defineEmits(['update:modelValue', 'update:visible']);

const query = ref('');
const visible = ref(false);
const chooser = ref<HTMLElement>();

watch(visible, () => {
  query.value = '';
});

function getTag(name: string) {
  return profileStore.getTagsByName(name) || new TagModel({ name });
}

const tagsToAdd = computed(
  () =>
    profileStore.profile!.tags.filter((tag) => {
      if (isSelected(tag.name)) return false;
      return !query.value || tag.name.match(new RegExp(escapeRegExp(query.value), 'i'));
    }) || [],
);

const selectedTags = computed(() =>
  props.modelValue
    .map((tagName) => getTag(tagName))
    .filter((tag) => !query.value || tag.name.match(new RegExp(escapeRegExp(query.value), 'i'))),
);

function addTag(name: string) {
  if (isSelected(name)) return;
  query.value = '';
  emit('update:modelValue', [...props.modelValue, name]);
}

function removeTag(name: string) {
  query.value = '';
  emit(
    'update:modelValue',
    props.modelValue.filter((tagName) => tagName !== name),
  );
}

function isSelected(name: string) {
  return props.modelValue.includes(name);
}

function isExistingTag(name: string) {
  return !!tagsToAdd.value.find((tag) => tag.name === name);
}

function focusFirst(evt: KeyboardEvent) {
  const entry = chooser.value?.querySelector('[data-tag-selection]') as HTMLElement;
  if (entry) {
    entry.focus();
  }
}

function focusNext(evt: KeyboardEvent) {
  const next = (<HTMLElement>evt.target).nextSibling as HTMLElement | null;
  if (next) {
    next.focus();
  }
}

function focusPrev(evt: KeyboardEvent) {
  const prev = (<HTMLElement>evt.target).previousSibling as HTMLElement | null;
  if (prev) {
    prev.focus();
  }
}

const entryClass =
  'flex items-center gap-2 border-divide bg-main p-2 md:p-4 cursor-pointer p-2 md:p-4 focus:outline-none hover:bg-highlight focus:bg-highlight';
</script>

<template>
  <floating-input-layout
    :input-id="inputId"
    class="floating-input cursor-pointer h-auto"
    :label="label"
    @click="visible = true">
    <div class="flex pt-2">
      <div v-for="tagName in modelValue" :key="tagName">
        <ly-tag :tag="getTag(tagName)" />
      </div>
    </div>
  </floating-input-layout>
  <ly-modal
    v-model="visible"
    title="tags.chooser.title"
    :cancel-button="false"
    submit-button-text="tags.chooser.submit"
    @submit="visible = false">
    <div ref="chooser" class="flex flex-col">
      <div>
        <ly-input-text
          v-model="query"
          :placeholder="$t('tags.chooser.query')"
          input-class="attachment-b"
          @keyup.down="focusFirst" />
      </div>

      <div class="flex flex-col border border-divide divide-y rounded-b">
        <div
          v-for="tag in selectedTags"
          :key="tag.name"
          data-tag-selection
          :class="entryClass"
          tabindex="0"
          @click="removeTag(tag.name)"
          @keyup.enter="removeTag(tag.name)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <ly-button
            tabindex="-1"
            aria-hidden="true"
            class="w-5 h-5 bg-main border border-divide rounded-full flex justify-center items-center text-sm px-0 py-0"
            ><span class="text-primary text-xs">x</span></ly-button
          >
          <ly-tag :tag="tag" />
        </div>
        <div
          v-for="tag in tagsToAdd"
          :key="tag.name"
          data-tag-selection
          :class="entryClass"
          tabindex="0"
          @click="addTag(tag.name)"
          @keyup.enter="addTag(tag.name)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <ly-tag :tag="tag" />
        </div>
        <div
          v-if="query.length && !isExistingTag(query)"
          data-tag-selection
          :class="[entryClass, 'rounded-b']"
          tabindex="0"
          @click="addTag(query)"
          @keyup.enter="addTag(query)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <i18n-t keypath="tags.chooser.add" tag="span" class="text-center text-dimmed text-sm">
            <template #tag>
              <b>{{ query }}</b>
            </template>
          </i18n-t>
        </div>
      </div>
    </div>
  </ly-modal>
</template>

<style scoped></style>

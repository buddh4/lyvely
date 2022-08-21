<script lang="ts" setup>
import { IJournal , DataPointInputType } from '@lyvely/common';
import ListEntry from "@/modules/calendar/components/CalendarPlanEntry.vue";
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import RangeInput from '@/modules/ui/components/form/RangeInput.vue';
import { useTimingStore } from '@/modules/calendar/store';
import { useJournalStore } from '@/modules/journal/store';
import { computed } from 'vue';

interface Props {
  model: IJournal
}

const props = defineProps<Props>();
defineEmits(["edit", "archive"]);

const log = computed(() => {
  const timingId = useTimingStore().getTimingId(props.model.interval);
  return useJournalStore().store.getLog(props.model, timingId, true);
});

const isRangeInput = computed(() => {
    return props.model.rating.inputType === DataPointInputType.Range;
});

const isTextInput = computed(() => props.model.rating.inputType === DataPointInputType.Textarea);

const selection = computed({
  get: () => isRangeInput.value ? -log.value.value : log.value.text,
  set: (value) => {
    const update = {
      log: log.value,
      value: isRangeInput.value ? -value : 0,
      text: isRangeInput.value ? "" : value
    };

    // Todo: delay in case of range with cancel timeout
    // Todo: delay in case of journal + blur
    //this.$store.dispatch(JournalActions.UPDATE_LOG, update);
  }
});

const isFuture = computed(() => useTimingStore().date > new Date());
const isDisabled = computed(() => isFuture.value || props.model.archived);
</script>

<template>
  <ListEntry
    :id="props.model.id"
    :categories="props.model.categories"
    @edit="$emit('edit', props.model)"
    @archive="$emit('archive', props.model)"
  >
    <template #title>
      {{ $t(props.model.title) }}
    </template>
    <template #rating>
      <template v-if="isRangeInput">
        {{ -selection }}
        <RangeInput
          v-model="selection"
          :min="props.model.definition.min"
          :max="props.model.definition.max"
          :mb="0"
        />
      </template>
      <template v-else-if="isTextInput">
        <Textarea v-model="selection"></Textarea>
      </template>
    </template>
  </ListEntry>
</template>

<style>
.timing-list .form-range {
  width: 200px;
}

.timing-list textarea {
  width: 280px;
  height: 200px;
}

.item-rating .form-floating {
  display: flex;
}
</style>

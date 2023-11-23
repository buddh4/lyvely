import { defineStore, storeToRefs } from 'pinia';
import { MilestoneModel, useMilestonesClient } from '@lyvely/milestones-interface';
import { ref, watch } from 'vue';
import { loadingStatus, useStatus, useProfileStore, useContentStore } from '@lyvely/web';

export const useMilestonesStore = defineStore('milestones', () => {
  let milestones = new Map<string, MilestoneModel>();
  const allLoaded = ref(false);
  const client = useMilestonesClient();
  const status = useStatus();
  const { profile } = storeToRefs(useProfileStore());

  watch(profile, reset);

  useContentStore().onContentCreated(MilestoneModel.contentType, setMilestone);
  useContentStore().onContentUpdated(MilestoneModel.contentType, setMilestone);

  function reset() {
    milestones = new Map<string, MilestoneModel>();
    allLoaded.value = false;
    status.resetStatus();
  }

  async function loadMilestone(mid: string): Promise<MilestoneModel> {
    const cached = milestones.get(mid);
    if (cached) return cached;

    const milestone = await client.getById(mid);
    setMilestone(milestone);
    return milestone;
  }

  async function loadMilestones(): Promise<MilestoneModel[]> {
    if (!allLoaded.value) {
      await loadingStatus(client.getAll(), status, undefined, (allMilestones) => {
        allMilestones.models.forEach((model) => setMilestone(model));
        allLoaded.value = true;
      });
    }

    return Array.from(milestones.values());
  }

  function setMilestone(milestone: MilestoneModel) {
    if (!milestone || milestone.pid !== profile.value?.id) return;
    milestones.set(milestone.id, milestone);
  }

  return {
    ...status,
    loadMilestone,
    loadMilestones,
  };
});

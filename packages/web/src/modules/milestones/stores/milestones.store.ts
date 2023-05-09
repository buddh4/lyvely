import { defineStore, storeToRefs } from 'pinia';
import { MilestoneModel } from '@lyvely/common';
import { useMilestonesService } from '@/modules/milestones/services/milestones.service';
import { ref, watch } from 'vue';
import { loadingStatus, useStatus } from '@/store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useMilestonesStore = defineStore('milestones', () => {
  let milestones = new Map<string, MilestoneModel>();
  const allLoaded = ref(false);
  const service = useMilestonesService();
  const status = useStatus();
  const { profile } = storeToRefs(useProfileStore());

  watch(profile, reset);

  function reset() {
    milestones = new Map<string, MilestoneModel>();
    allLoaded.value = false;
    status.resetStatus();
  }

  async function loadMilestone(mid: string): Promise<MilestoneModel> {
    const cached = milestones.get(mid);
    if (cached) return cached;

    const milestone = await service.getById(mid);
    setMilestone(milestone);
    return milestone;
  }

  async function loadMilestones(): Promise<MilestoneModel[]> {
    if (!allLoaded.value) {
      await loadingStatus(service.getAll(), status, undefined, (allMilestones) => {
        allMilestones.models.forEach((model) => setMilestone(model));
        allLoaded.value = true;
      });
    }

    return Array.from(milestones.values());
  }

  function setMilestone(milestone: MilestoneModel) {
    if (!milestone) return;
    milestones.set(milestone.id, milestone);
  }

  return {
    ...status,
    loadMilestone,
    loadMilestones,
  };
});

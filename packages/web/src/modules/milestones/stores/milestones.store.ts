import { defineStore } from 'pinia';
import { MilestoneModel } from '@lyvely/common';
import { useMilestonesService } from '@/modules/milestones/services/milestones.service';
import { ref } from 'vue';

export const useMilestonesStore = defineStore('milestones', () => {
  const milestones = new Map<string, MilestoneModel>();
  const allLoaded = ref(false);
  const service = useMilestonesService();

  async function loadMilestone(mid: string): Promise<MilestoneModel> {
    const cached = milestones.get(mid);
    if (cached) return cached;

    const milestone = await service.getById(mid);
    setMilestone(milestone);
    return milestone;
  }

  async function loadMilestones(): Promise<MilestoneModel[]> {
    if (!allLoaded.value) {
      const allMilestones = await service.getAll();
      allMilestones.models.forEach((model) => setMilestone(model));
      allLoaded.value = true;
    }

    return Array.from(milestones.values());
  }

  function setMilestone(milestone: MilestoneModel) {
    if (!milestone) return;
    milestones.set(milestone.id, milestone);
  }

  return {
    loadMilestone,
    loadMilestones,
  };
});

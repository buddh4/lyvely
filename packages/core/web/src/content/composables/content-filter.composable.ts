import { IContentFilter, TagFilter } from '@lyvely/interface';
import { computed, watch } from 'vue';
import { LocationQuery, Router } from 'vue-router';
import { useFilterOption } from '@/core';
import { useProfileStore } from '@/profiles/stores/profile.store';

export interface IContentFilterComposableOptions<TFilter extends IContentFilter = IContentFilter> {
  router: Router;
  filter: TFilter;
  queryHandler?: (filter: TFilter, query: LocationQuery) => void;
}
export function useContentFilter<TFilter extends IContentFilter = IContentFilter>(
  options: IContentFilterComposableOptions<TFilter>,
) {
  let filterPath: string | undefined = undefined;

  const profileStore = useProfileStore();
  const { router, filter, queryHandler } = options;

  const tags = computed(() => new TagFilter({ archived: false }).apply(profileStore.getTags()));
  const activeTagId = computed(() => filter.option('tagId'));

  const unwatchFilter = watch(filter, () => {
    const currentRoute = router.currentRoute.value;
    const query = {
      ...currentRoute.query,
      ...filter.getOptionsWithStringValues(),
    };

    if (!filter.option('archived')) delete query.archived;
    if (!filter.option('tagId')) delete query.tagId;
    if (queryHandler) queryHandler(filter, query);

    // This is activities specific, maybe we should move this to some kind of hook, but doesn't hurt...
    delete query.type;

    const route = router.resolve({ path: currentRoute.path, query: query });

    if (route.fullPath !== currentRoute.fullPath) {
      // Prevent update loops
      filterPath = route.fullPath;
      router.replace({ path: currentRoute.path, query: query });
    }
  });

  const unwatchRoute = watch(
    router.currentRoute,
    (to) => {
      if (to.fullPath !== filterPath) {
        // Prevent update loops
        filterPath = to.fullPath;
        setFilterFromRoute();
      }
    },
    { immediate: true },
  );

  function stopWatch() {
    unwatchFilter();
    unwatchRoute();
  }

  function setFilterFromRoute() {
    const currentRoute = router.currentRoute.value;
    filter.reset();
    filter.setOptions(currentRoute.query);
  }

  function setTagFilter(tagId?: string) {
    filter.setOptions({ tagId });
  }

  const archiveFilter = useFilterOption(filter, 'archived');
  const queryFilter = useFilterOption(filter, 'query');

  return {
    stopWatch,
    setFilterFromRoute,
    setTagFilter,
    archiveFilter,
    queryFilter,
    tags,
    activeTagId,
  };
}

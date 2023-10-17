import { IFeature } from '@/features/interfaces';

const features = new Map<string, IFeature>();

export function registerFeatures(featuresToAdd: IFeature[]) {
  featuresToAdd.forEach((f) => features.set(f.id, f));
}

export function clearFeatures() {
  features.clear();
}

export function getFeature(id: string) {
  return features.get(id);
}

export function getAllFeatures() {
  return features.values();
}

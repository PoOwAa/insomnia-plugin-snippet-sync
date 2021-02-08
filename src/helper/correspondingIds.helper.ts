import { InsomniaBaseModel } from '../types/basemodel.type';

export function correspondingIds(
  resources: InsomniaBaseModel[],
  searchId: string,
): string[] {
  return [...getCorrespondingIds(resources, searchId)];
}

function getCorrespondingIds(
  resources: InsomniaBaseModel[],
  searchId: string,
): Set<string> {
  let ret: Set<string> = new Set();

  for (const resource of resources) {
    if (resource._id === searchId) {
      ret.add(resource._id);
    }

    if (resource.parentId === searchId) {
      ret = new Set([...ret, ...getCorrespondingIds(resources, resource._id)]);
    }
  }

  return ret;
}

import { InsomniaBaseModel } from '../types/basemodel.type';

export function solveConflict(rawLocal: string, rawRemote: string) {
  const remote = JSON.parse(rawRemote);
  if (rawLocal.length === 0) {
    return remote;
  }

  const resources: InsomniaBaseModel[] = [];

  const local = JSON.parse(rawLocal);

  remote.resources.forEach((entry: InsomniaBaseModel) => {
    const localEntry = local.resources.find(
      (item: InsomniaBaseModel) => item._id === entry._id,
    );

    if (!localEntry) {
      resources.push(localEntry);
    } else {
      if (entry.modified > localEntry.modified) {
        resources.push(entry);
      } else {
        resources.push(localEntry);
      }
    }
  });

  local.resources.forEach((entry: InsomniaBaseModel) => {
    const remoteEntry = resources.find((item) => item._id === entry._id);

    if (!remoteEntry) {
      resources.push(entry);
    }
  });

  const ret = local;
  ret.resources = resources;
  return ret;
}

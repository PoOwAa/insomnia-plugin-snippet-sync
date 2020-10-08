import { InsomniaBaseModel } from '../types/basemodel.type';

export function solveConflict(rawLocal: string, rawRemote: string) {
  const remote = JSON.parse(rawRemote);
  const local = JSON.parse(rawLocal);
  if (local.resources.length === 0) {
    return remote;
  }

  let resources: InsomniaBaseModel[] = [];

  remote.resources.forEach((entry: InsomniaBaseModel) => {
    const localEntry = local.resources.find(
      (item: InsomniaBaseModel) => item._id === entry._id,
    );

    if (!localEntry) {
      // console.log(`No local entry found for [${entry._id}], adding:`);
      resources.push(entry);
    } else {
      if (entry.modified > localEntry.modified) {
        // console.log(`Remote is newer, using that. [${entry._id}]`);
        resources.push(entry);
      } else {
        // console.log(`Local is newer, using that. [${localEntry._id}]`);
        resources.push(localEntry);
      }
    }
  });

  const oldLength = resources.length;
  resources = resources.filter((r) => r);
  // console.log(
  //   `Cleaning up. Old size [${oldLength}] new size [${resources.length}]`,
  // );

  local.resources.forEach((entry: InsomniaBaseModel) => {
    const remoteEntry = resources.find((item) => item._id === entry._id);

    if (!remoteEntry) {
      // console.log(`Entry [${entry._id}} not found in remote, using local.`);
      resources.push(entry);
    }
  });

  const ret = local;
  ret.resources = resources;
  return ret;
}

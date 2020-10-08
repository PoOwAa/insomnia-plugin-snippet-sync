import { InsomniaWorkspaceAction } from '../types/workspace-action.type';
import { storeKey } from '../helper/storeKey.helper';
import {
  InsomniaContext,
  InsomniaWorkspaceActionModel,
} from '../types/insomnia.types';

export const workspaceConfigAction: InsomniaWorkspaceAction = {
  label: 'Workspace config',
  icon: 'fa-gear',
  action: async (
    context: InsomniaContext,
    models: InsomniaWorkspaceActionModel,
  ) => {
    await loadWorkspaceConfig(context, models);
  },
};

async function loadWorkspaceConfig(
  context: InsomniaContext,
  models: InsomniaWorkspaceActionModel,
) {
  const workspaceId = models.workspace._id;

  const oldData = await context.store.getItem(storeKey(workspaceId));
  let projectId: string = '';
  try {
    projectId = await context.app.prompt('Snippet Configuration - Workspace', {
      label: 'Remote configuration:',
      defaultValue: oldData || `{ "projectId": "1", "snippetId": "1" }`,
      submitName: 'Save',
      cancelable: true,
    });
  } catch (e) {
    console.log('Prompt escape');
    return false;
  }

  await context.store.setItem(storeKey(workspaceId), projectId);
}

import { storeKey } from '../helper/storeKey.helper';
import { InsomniaWorkspaceAction } from '../types/workspace-action.type';
import {
  InsomniaWorkspaceActionModel,
  InsomniaContext,
  InsomniaContextDataExportResult,
} from '../types/insomnia.types';
import {
  SnippetSyncAuthConfig,
  SnippetSyncWorkspaceConfig,
  SnippetSyncConfig,
} from '../interface/snippetSyncConfig.interface';
import { GitlabService } from '../service/gitlab.service';
import { InsomniaBaseModel } from '../types/basemodel.type';
import { correspondingIds } from '../helper/correspondingIds.helper';

export const uploadAction: InsomniaWorkspaceAction = {
  label: 'Workspace upload',
  icon: 'fa-upload',
  action: async (
    context: InsomniaContext,
    models: InsomniaWorkspaceActionModel,
  ) => {
    const authConfig = await context.store.getItem('auth');

    if (!authConfig) {
      console.error(`Couldn't get auth config!`);
      throw new Error(`Couldn't get auth config!`);
    }

    const workspaceConfig = await context.store.getItem(
      storeKey(models.workspace._id),
    );
    if (!workspaceConfig) {
      console.error(`Couldn't get workspace config!`);
      throw new Error(`Couldn't get workspace config!`);
    }
    const auth: SnippetSyncAuthConfig = JSON.parse(authConfig);
    const workspace: SnippetSyncWorkspaceConfig = JSON.parse(workspaceConfig);

    const config: SnippetSyncConfig = {
      auth,
      workspace,
    };

    const provider = new GitlabService(context, config);

    const local = await context.data.export.insomnia({
      includePrivate: false,
      format: 'json',
    });

    const exportedData: InsomniaContextDataExportResult = JSON.parse(local);
    const idFilter: string[] = correspondingIds(
      exportedData.resources,
      models.workspace._id,
    );
    exportedData.resources = exportedData.resources.filter(
      (resource: InsomniaBaseModel) =>
        idFilter.includes(resource._id) || idFilter.includes(resource.parentId),
    );

    const localRaw = JSON.stringify(exportedData, null, 2);

    try {
      if (
        !config.workspace.snippetId ||
        config.workspace.snippetId.length === 0
      ) {
        const snippetId = await provider.createSnippet(localRaw);
        workspace.snippetId = snippetId;
        await context.store.setItem(
          storeKey(models.workspace._id),
          JSON.stringify(workspace),
        );
      } else {
        provider.updateSnippet(localRaw);
      }
    } catch (e) {
      await context.app.alert('Failed to upload snippet!', e.message);
      return;
    }
  },
};

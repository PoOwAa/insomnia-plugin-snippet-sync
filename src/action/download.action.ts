import { InsomniaWorkspaceAction } from '../types/workspace-action.type';
import { storeKey } from '../helper/storeKey.helper';
import {
  InsomniaWorkspaceActionModel,
  InsomniaContext,
} from '../types/insomnia.types';
import {
  SnippetSyncAuthConfig,
  SnippetSyncWorkspaceConfig,
  SnippetSyncConfig,
} from '../interface/snippetSyncConfig.interface';
import { GitlabService } from '../service/gitlab.service';
import { solveConflict } from '../helper/solveConflict.helper';

export const downloadAction: InsomniaWorkspaceAction = {
  label: 'Workspace download',
  icon: 'fa-download',
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

    try {
      const remote = await provider.getSnippet();

      const local = await context.data.export.insomnia({
        includePrivate: false,
        format: 'json',
      });

      const localRaw = JSON.stringify(JSON.parse(local), null, 2);

      const content = JSON.stringify(solveConflict(localRaw, remote));

      await context.data.import.raw(content, {
        workspaceId: models.workspace._id,
      });
    } catch (e) {
      console.error(e);
      await context.app.alert('Failed to download snippet!', e.message);
      return;
    }
  },
};

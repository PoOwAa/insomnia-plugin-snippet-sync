import { InsomniaWorkspaceAction } from '../types/workspace-action.type';
import {
  InsomniaContext,
  InsomniaWorkspaceActionModel,
} from '../types/insomnia.types';

export const authAction: InsomniaWorkspaceAction = {
  label: 'Snippet Sync Authentication',
  icon: 'fa-user',
  action: async (
    context: InsomniaContext,
    models: InsomniaWorkspaceActionModel,
  ) => {
    await loadConfig(context, models);
  },
};

async function loadConfig(
  context: InsomniaContext,
  models: InsomniaWorkspaceActionModel,
) {
  const oldData = await context.store.getItem('auth');

  let input: string = '';
  try {
    input = await context.app.prompt('Snippet Configuration - Authentication', {
      label: 'Credentials JSON',
      defaultValue:
        oldData ||
        `{"provider": "gitlab", "url": "https://gitlab.com/", "token": "YOUR_ACCESS_TOKEN_HERE" }`,
      submitName: 'Save',
      cancelable: true,
    });
  } catch (e) {
    console.log('Prompt escape');
    return false;
  }

  // TODO: validate config json

  await context.store.setItem('auth', input);
}

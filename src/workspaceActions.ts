import { InsomniaWorkspaceAction } from './types/workspace-action.type';
import { authAction } from './action/auth.action';
import { workspaceConfigAction } from './action/config.action';
import { downloadAction } from './action/download.action';
import { uploadAction } from './action/upload.action';

export const workspaceActions: InsomniaWorkspaceAction[] = [
  authAction,
  workspaceConfigAction,
  downloadAction,
  uploadAction,
];

export interface SnippetSyncConfig {
  auth: SnippetSyncAuthConfig;
  workspace: SnippetSyncWorkspaceConfig;
}

export interface SnippetSyncAuthConfig {
  token: string;
  baseUrl: string;
  timeout: number;
}

export interface SnippetSyncWorkspaceConfig {
  snippetId: string;
  projectId: string;
}

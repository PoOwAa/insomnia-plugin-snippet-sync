import { SnippetSyncConfig } from '../interface/snippetSyncConfig.interface';
import axios, { AxiosInstance } from 'axios';
import { InsomniaContext } from '../types/insomnia.types';

export class GitlabService {
  private http: AxiosInstance;
  private apiUrl: string;
  private config: SnippetSyncConfig;

  constructor(readonly context: InsomniaContext, config: SnippetSyncConfig) {
    this.config = config;
    this.apiUrl = `${config.auth.baseUrl}/api/v4/projects/${this.config.workspace.projectId}`;
    this.http = axios.create({
      baseURL: this.apiUrl,
      timeout: this.config.auth.timeout,
      headers: {
        Authorization: `Bearer ${this.config.auth.token}`,
      },
    });
  }

  async getSnippet(): Promise<string> {
    try {
      const response = await this.http.get(
        `${this.apiUrl}/snippets/${this.config.workspace.snippetId}/raw`,
      );

      return JSON.stringify(response.data);
    } catch (e) {
      console.error(e);
      throw `Couldn't load the snippet!`;
    }
  }

  async createSnippet(content: string): Promise<string> {
    const response = await this.http.post(`${this.apiUrl}/snippets`, {
      title: 'Insomnia workspace data',
      file_name: 'insomnia_data.json',
      content,
      visibility: 'private',
    });

    return response.data.id;
  }

  async updateSnippet(content: string) {
    return this.http.put(
      `${this.apiUrl}/snippets/${this.config.workspace.snippetId}`,
      {
        content,
      },
    );
  }
}

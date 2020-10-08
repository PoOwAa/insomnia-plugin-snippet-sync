export type Plugin = {
  name: string;
  description: string;
  version: string;
  directory: string;
  config: PluginConfig;
  module: any;
};

export type PluginConfig = {
  disabled: boolean;
};

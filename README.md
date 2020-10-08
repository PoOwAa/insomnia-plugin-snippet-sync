# Insomnia Workspace Snippet Sync

This is a plugin for [Insomnia](https://insomnia.rest) that allows users sync workspaces with GitLab snippets, every workspace is a separate snippet.

## Installation

Install the `insomnia-plugin-snippet-sync` plugin from Preferences > Plugins.

## Configure

### 1. Create a personal access token.

[GitLab access token docs](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#creating-a-personal-access-token) with the `api` scopre.

### 2. Go to Insomnia, click on your workspace name, then create a new one!

### 3. Click on new workspace name and click on "Snippet Sync Authentication"

![Plugin Screenshot](/screenshot.png)

Example config:

```
{
    "provider": "gitlab",
    "baseUrl": "https://your.gitlab.host",
    "token": "PERSONAL_ACCESS_TOKEN"
}
```

### 4. Go to your GitLab and search project ID

### 5. Go to Insomnia, and click on "Workspace Config"

Example config:

```
{
    "projectId": 4
}
```

If you already have a snippet in your repository for insomnia config, then use the following:

```
{
    "projectId": 4,
    "snippetId": YOUR_SNIPPET_ID
}
```

## TODO

- [ ] Configuration options in README
- [ ] Configuration validation
- [ ] Optional workspace level provider settings
- [ ] Refactor typescript types
- [ ] Tests
- [ ] Solve delete sync

## Usage

- Click on `Workspace upload` to upload your workspace into GitLab Snippet.
- Click on `Workspace download` to download your workspace settings from GitLab Snippet.

> If you are really interested on preserving integrity working with a team, please [support insomnia](https://insomnia.rest/pricing/) with a team membership.

const GITHUB_API_BASE_URL = 'https://api.github.com';

class GitHubWrapper {
  constructor() {
    this.apiUrl = 'https://api.github.com';
    this.headers = {};
    this.owner = '';
    this.repo = '';
  }

  init(token, repoUrl) {
    this.headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };

    const parsedUrl = new URL(repoUrl);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      this.owner = pathParts[0];
      this.repo = pathParts[1];
    } else {
      throw new Error('Invalid repository URL');
    }
  }

  async createFile(path, content) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        message: `Create ${path}`,
        content: btoa(unescape(encodeURIComponent(content)))
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async deleteFile(path, sha) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify({
        message: `Delete ${path}`,
        sha: sha
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async deleteFolder(path) {
    try {
      const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`, {
        method: 'GET',
        headers: this.headers
      });

      if (response.status === 404) {
        console.log(`Folder ${path} not found, no need to delete.`);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      for (const file of data) {
        if (file.type === 'dir') {
          await this.deleteFolder(`${path}/${file.name}`);
        } else {
          await this.deleteFile(`${path}/${file.name}`, file.sha);
        }
      }

      console.log(`Folder ${path} and its contents deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting folder ${path}:`, error);
      throw error;
    }
  }
}

// Expose GitHubWrapper to the global scope
window.GitHubWrapper = GitHubWrapper;

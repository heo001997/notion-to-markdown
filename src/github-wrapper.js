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

  async createFile(path, content, isBinary = false) {
    try {
      const body = {
        message: `Create ${path}`,
        content: isBinary ? content : btoa(unescape(encodeURIComponent(content)))
      };

      const createResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(body)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(`HTTP error! status: ${createResponse.status}, message: ${JSON.stringify(errorData)}`);
      }

      return createResponse.json();
    } catch (error) {
      console.error(`Error creating file ${path}:`, error);
      throw error;
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
      if (response.status === 404) {
        console.log(`File ${path} already deleted or not found.`);
        return;
      } else if (response.status === 409) {
        console.log(`File ${path} conflicted, maybe already deleted or not found.`);
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async deleteAndCreateFiles(foldersToDelete, filesToCreate) {
    console.log(`Deleting folders and creating files in one commit...`);
    
    try {
      const latestCommitSha = await this.getLatestCommitSha();
      
      const branchName = `update-content-${Date.now()}`;
      await this.createBranch(branchName, latestCommitSha);

      const treeData = await this.getTree(latestCommitSha);
      
      const newTree = treeData.tree
        .filter(item => !foldersToDelete.some(folder => item.path.startsWith(folder)))
        .map(item => ({
          path: item.path,
          mode: item.mode,
          type: item.type,
          sha: item.sha
        }));

      const binaryFiles = filesToCreate.filter(file => file.isBinary);
      const textFiles = filesToCreate.filter(file => !file.isBinary);

      const blobShas = await this.createBlobs(binaryFiles.map(file => file.content));

      binaryFiles.forEach((file, index) => {
        newTree.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blobShas[index]
        });
      });

      textFiles.forEach(file => {
        newTree.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content
        });
      });

      const newTreeSha = await this.createTree(newTree);
      
      const newCommitSha = await this.createCommit(`Delete folders and create files`, newTreeSha, [latestCommitSha]);
      
      await this.updateBranchRef(branchName, newCommitSha);
      
      const prNumber = await this.createPullRequest(`Delete folders and create files`, branchName, 'main');
      
      await this.mergePullRequest(prNumber);
      
      console.log(`Folders deleted and files created successfully in one commit`);
    } catch (error) {
      console.error(`Error deleting folders and creating files:`, error);
      throw error;
    }
  }

  async getLatestCommitSha(branch = 'main') {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/ref/heads/${branch}`, {
      method: 'GET',
      headers: this.headers
    });
    if (!response.ok) throw new Error(`Failed to get latest commit: ${response.statusText}`);
    const data = await response.json();
    return data.object.sha;
  }

  async createBranch(branchName, sha) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/refs`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: sha
      })
    });
    if (!response.ok) throw new Error(`Failed to create branch: ${response.statusText}`);
  }

  async getTree(sha) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/trees/${sha}?recursive=1`, {
      method: 'GET',
      headers: this.headers
    });
    if (!response.ok) throw new Error(`Failed to get tree: ${response.statusText}`);
    return response.json();
  }

  async createTree(tree) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/trees`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tree })
    });
    if (!response.ok) throw new Error(`Failed to create new tree: ${response.statusText}`);
    const data = await response.json();
    return data.sha;
  }

  async createCommit(message, tree, parents) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/commits`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, tree, parents })
    });
    if (!response.ok) throw new Error(`Failed to create commit: ${response.statusText}`);
    const data = await response.json();
    return data.sha;
  }

  async updateBranchRef(branch, sha) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sha, force: true })
    });
    if (!response.ok) throw new Error(`Failed to update branch reference: ${response.statusText}`);
  }

  async createPullRequest(title, head, base) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/pulls`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, head, base })
    });
    if (!response.ok) throw new Error(`Failed to create pull request: ${response.statusText}`);
    const data = await response.json();
    return data.number;
  }

  async mergePullRequest(pullNumber) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/pulls/${pullNumber}/merge`, {
      method: 'PUT',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ merge_method: 'merge' })
    });
    if (!response.ok) throw new Error(`Failed to merge pull request: ${response.statusText}`);
  }

  async createBlobs(contents) {
    const batchSize = 40;
    const results = [];

    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);
      const promises = batch.map(content => this.createSingleBlob(content));
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }

    return results;
  }

  async createSingleBlob(content) {
    const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/blobs`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, encoding: 'base64' })
    });
    if (!response.ok) throw new Error(`Failed to create blob: ${response.statusText}`);
    const data = await response.json();
    return data.sha;
  }
}

// Expose GitHubWrapper to the global scope
window.GitHubWrapper = GitHubWrapper;

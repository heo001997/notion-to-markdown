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

  async deleteFolder(path, maxRetries = 5) {
    console.log(`Deleting folder: ${path}`);
    
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    async function getLatestCommitSha(branch = 'main') {
      const refResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/ref/heads/${branch}`, {
        method: 'GET',
        headers: this.headers
      });
      if (!refResponse.ok) throw new Error(`Failed to get latest commit: ${refResponse.statusText}`);
      const refData = await refResponse.json();
      return refData.object.sha;
    }

    async function attemptDelete(retryCount = 0) {
      try {
        const latestCommitSha = await getLatestCommitSha.call(this);

        // Create a new branch
        const branchName = `delete-${path.replace(/\//g, '-')}-${Date.now()}`;
        const createBranchResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/refs`, {
          method: 'POST',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: latestCommitSha
          })
        });

        if (!createBranchResponse.ok) {
          throw new Error(`Failed to create branch: ${createBranchResponse.statusText}`);
        }

        // Get the tree of the latest commit
        const treeResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/trees/${latestCommitSha}?recursive=1`, {
          method: 'GET',
          headers: this.headers
        });

        if (!treeResponse.ok) {
          throw new Error(`Failed to get tree: ${treeResponse.statusText}`);
        }

        const treeData = await treeResponse.json();

        // Create a new tree with the folder removed
        const newTree = treeData.tree
          .filter(item => !item.path.startsWith(path))
          .map(item => ({
            path: item.path,
            mode: item.mode,
            type: item.type,
            sha: item.sha
          }));

        const createTreeResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/trees`, {
          method: 'POST',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tree: newTree
          })
        });

        if (!createTreeResponse.ok) {
          throw new Error(`Failed to create new tree: ${createTreeResponse.statusText}`);
        }

        const newTreeData = await createTreeResponse.json();

        // Create a new commit on the new branch
        const commitResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/commits`, {
          method: 'POST',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Delete ${path}`,
            tree: newTreeData.sha,
            parents: [latestCommitSha]
          })
        });

        if (!commitResponse.ok) {
          throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
        }

        const commitData = await commitResponse.json();

        // Update the new branch to point to the new commit
        const updateBranchResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/git/refs/heads/${branchName}`, {
          method: 'PATCH',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sha: commitData.sha,
            force: true
          })
        });

        if (!updateBranchResponse.ok) {
          throw new Error(`Failed to update branch: ${updateBranchResponse.statusText}`);
        }

        // Create a pull request
        const createPrResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/pulls`, {
          method: 'POST',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `Delete ${path}`,
            head: branchName,
            base: 'main',
            body: `This PR deletes the folder ${path}`
          })
        });

        if (!createPrResponse.ok) {
          throw new Error(`Failed to create pull request: ${createPrResponse.statusText}`);
        }

        const prData = await createPrResponse.json();

        // Merge the pull request
        const mergePrResponse = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/pulls/${prData.number}/merge`, {
          method: 'PUT',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            merge_method: 'merge'
          })
        });

        if (!mergePrResponse.ok) {
          throw new Error(`Failed to merge pull request: ${mergePrResponse.statusText}`);
        }

        console.log(`Folder ${path} deleted successfully`);
      } catch (error) {
        if (retryCount < maxRetries) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Error occurred. Retrying in ${waitTime}ms...`);
          await delay(waitTime);
          return attemptDelete.call(this, retryCount + 1);
        }
        throw error;
      }
    }

    try {
      await attemptDelete.call(this);
    } catch (error) {
      console.error(`Error deleting folder ${path}:`, error);
      throw error;
    }
  }

  async createFiles(files) {
    for (const file of files) {
      try {
        await this.createFile(file.path, file.content, file.isBinary);
        console.log(`Created file: ${file.path}`);
      } catch (error) {
        console.error(`Error creating file ${file.path}:`, error);
        throw error;
      }
    }
  }
}

// Expose GitHubWrapper to the global scope
window.GitHubWrapper = GitHubWrapper;

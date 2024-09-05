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
    console.log(`Creating ${files.length} files...`);
    
    try {
      const latestCommitSha = await this.getLatestCommitSha();
      
      // Create a new branch
      const branchName = `create-files-${Date.now()}`;
      await this.createBranch(branchName, latestCommitSha);

      // Get the current tree
      const treeData = await this.getTree(latestCommitSha);
      
      // Create blobs for images and prepare new tree
      const newTree = [];
      const binaryFiles = files.filter(file => file.isBinary);
      const textFiles = files.filter(file => !file.isBinary);

      // Process binary files in parallel with a maximum of 30 concurrent operations
      const chunkSize = 30;
      for (let i = 0; i < binaryFiles.length; i += chunkSize) {
        const chunk = binaryFiles.slice(i, i + chunkSize);
        const blobPromises = chunk.map(file => this.createBlob(file.content));
        const blobShas = await Promise.all(blobPromises);
        
        chunk.forEach((file, index) => {
          newTree.push({
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobShas[index]
          });
        });
      }

      // Add text files to the tree
      textFiles.forEach(file => {
        newTree.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content
        });
      });
      
      // Add existing tree items
      newTree.push(...treeData.tree);
      
      const newTreeSha = await this.createTree(newTree);
      
      // Create a new commit
      const newCommitSha = await this.createCommit(`Create ${files.length} files`, newTreeSha, [latestCommitSha]);
      
      // Update the branch reference
      await this.updateBranchRef(branchName, newCommitSha);
      
      // Create a pull request
      const prNumber = await this.createPullRequest(`Create ${files.length} files`, branchName, 'main');
      
      // Merge the pull request
      await this.mergePullRequest(prNumber);
      
      console.log(`Created ${files.length} files successfully`);
    } catch (error) {
      console.error(`Error creating files:`, error);
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

  async createBlob(content) {
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

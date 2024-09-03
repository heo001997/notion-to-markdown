function formatDate(dateString) {
  const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
  };
  return new Date(dateString).toLocaleString(undefined, options);
}

// Add these variables at the top of your file, after other variable declarations
let parseButtonElement;
let parseTableElement;
let githubSyncFormElement;

// Add this function
function toggleParseAndSyncVisibility(show) {
    if (parseButtonElement) parseButtonElement.style.display = show ? 'block' : 'none';
    if (githubSyncFormElement) githubSyncFormElement.style.display = show ? 'block' : 'none';
}

async function convertNotionPage(notionSecret, pageId) {
  const resultElement = document.getElementById('result');
  const resultActionsElement = document.getElementById('resultActions');
  const parseButtonElement = document.getElementById('parseButton');
  const parseTableElement = document.getElementById('parseTable');
  const testMode = document.getElementById('testMode').checked;
  const resultTitleElement = document.getElementById('resultTitle');

  if (!notionSecret || !pageId) {
      resultElement.textContent = 'Error: Missing notion_secret or page_id';
      resultElement.style.display = 'block';
      resultActionsElement.style.display = 'none';
      parseButtonElement.style.display = 'none';
      return;
  }
  try {
      let result;
      const storedData = localStorage.getItem('notionMarkdown');

      if (testMode && storedData) {
          console.log("Test mode: Using stored data.");
          result = JSON.parse(storedData);
      } else {
          result = await window.getNotionPageMarkdown(notionSecret, pageId);
          
          if (result.error) {
              resultElement.textContent = result.error;
              resultElement.style.display = 'block';
              resultActionsElement.style.display = 'none';
              parseButtonElement.style.display = 'none';
              return;
          }
          
          localStorage.setItem('notionMarkdown', JSON.stringify(result));
      }
      
      const { lastEditedTime, markdown, title } = result;
      
      if (lastEditedTime) {
          const formattedDate = formatDate(lastEditedTime);
          document.getElementById('lastEdited').textContent = `Last edited: ${formattedDate}`;
      } else {
          document.getElementById('lastEdited').textContent = '';
      }
      
      console.log("Title from Notion:", title); // Add this line for debugging
      resultTitleElement.textContent = title || 'Untitled';
      resultElement.textContent = markdown;
      
      if (markdown && markdown.trim() !== '') {
          resultElement.style.display = 'block';
          resultTitleElement.style.display = 'block';
          resultActionsElement.style.display = 'flex';
          toggleParseAndSyncVisibility(true);
          
          let parseButtonContainer = document.getElementById('parseButtonContainer');
          if (!parseButtonContainer) {
              parseButtonContainer = document.createElement('div');
              parseButtonContainer.id = 'parseButtonContainer';
              parseButtonElement.parentNode.insertBefore(parseButtonContainer, parseButtonElement);
          }
          
          parseButtonContainer.appendChild(parseButtonElement);
      } else {
          resultElement.style.display = 'none';
          resultTitleElement.style.display = 'none';
          resultActionsElement.style.display = 'none';
          toggleParseAndSyncVisibility(false);
          if (parseTableElement) parseTableElement.style.display = 'none';
      }
  } catch (error) {
      console.error("Error in convertNotionPage:", error); // Add this line for debugging
      resultElement.textContent = `Error: ${error.message}`;
      resultElement.style.display = 'block';
      resultTitleElement.style.display = 'none';
      resultActionsElement.style.display = 'none';
      toggleParseAndSyncVisibility(false);
      if (parseTableElement) parseTableElement.style.display = 'none';
  }
}

function loadFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const notionSecret = urlParams.get('notion_secret');
  const pageId = urlParams.get('page_id');
  const githubToken = urlParams.get('github_token');
  const githubRepo = urlParams.get('github_repo');

  if (notionSecret) {
      document.getElementById('notionSecret').value = notionSecret;
  }
  if (pageId) {
      document.getElementById('pageId').value = pageId;
  }
  if (githubToken) {
      document.getElementById('githubToken').value = githubToken;
  }
  if (githubRepo) {
      const repoUrl = new URL(githubRepo);
      const pathParts = repoUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
          const owner = pathParts[0];
          const repo = pathParts[1];
          document.getElementById('githubRepo').value = `https://github.com/${owner}/${repo}`;
      }
  }
}

function generateTableHtml(parsedContent) {
  let tableHtml = '<table class="sync-table">';
  tableHtml += '<thead><tr><th>ID</th><th>Level</th><th>Title</th><th>Content Preview</th><th>Content</th><th>Sync</th></tr></thead>';
  tableHtml += '<tbody>';

  let id = 1;
  parsedContent.forEach(section => {
    if (section.type.startsWith('h') && parseInt(section.type[1]) <= 5) {
      const level = section.type[1];
      const title = section.title;
      const contentPreview = section.content.join(' ').substring(0, 100) + '...';
      const fullContent = section.content.join('\n');
      
      tableHtml += `<tr data-id="${id}">
          <td>${id}</td>
          <td>H${level}</td>
          <td>${title}</td>
          <td>${contentPreview}</td>
          <td><textarea class="content-textarea" readonly>${fullContent}</textarea></td>
          <td class="sync-status">&#x25CF;</td>
      </tr>`;
      id++;
    }
  });

  tableHtml += '</tbody></table>';
  return tableHtml;
}

function restructureChapterStructure(rows) {
  const result = [];
  const stack = [];

  rows.forEach(row => {
    const level = parseInt(row.cells[1].textContent.slice(1));
    const current = {
      id: row.cells[0].textContent,
      level: row.cells[1].textContent,
      title: row.cells[2].textContent,
      content: row.cells[4].querySelector('textarea').value,
      children: []
    };
    
    while (stack.length > 0 && getLevel(stack[stack.length - 1]) >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(current);
    } else {
      stack[stack.length - 1].children.push(current);
    }

    stack.push(current);
  });

  return result;
}

function getLevel(item) {
  return parseInt(item.level.slice(1));
}

function generateFolderStructure(chapterStructure) {
  console.log('Generating folder structure:', chapterStructure);
  const structure = [];
  let folderIndex = 1;
  let currentFolder = null;
  let subIndex = {};

  // Add the main _index.md file
  structure.push({
    path: 'content/_index.md',
    content: `+++
archetype = "home"
title = "${document.getElementById('resultTitle').textContent}"
+++

Discover what this workshop is all about and the core-concepts behind it.
`
});

  function processItem(item, parentPath = '') {
    const level = parseInt(item.level.slice(1));
    const title = item.title
      .toLowerCase()
      .replace(/\./g, '-')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let path;
    let hierarchy;

    if (level === 1) {
      currentFolder = `${folderIndex.toString().padStart(3, '0')}-${title}`;
      path = `content/${currentFolder}`;
      folderIndex++;
      subIndex[currentFolder] = 1;
    } else {
      const fileName = `${subIndex[currentFolder].toString().padStart(3, '0')}-${title}`;
      hierarchy = `${currentFolder}/${fileName}`;
      path = `content/${hierarchy}`;
    }

    if (level === 1) {
      // Always create a folder with _index.md for level 1
      structure.push({
        id: item.id,
        path: `${path}/_index.md`,
        content: `+++
archetype = "chapter"
title = "${item.title}"
weight = ${folderIndex - 1}
+++

${item.content}
`
      });
      item.children.forEach(child => processItem(child, path));
    } else if (item.children && item.children.length > 0) {
      // Create a folder with _index.md for other levels with children
      const weight = subIndex[currentFolder];
      subIndex[currentFolder]++;
      subIndex[hierarchy] = 1;
      currentFolder = hierarchy
      structure.push({
        id: item.id,
        path: `${path}/_index.md`,
        content: `+++
title = "${item.title}"
weight = ${weight}
+++

${item.content}
`
      });
      item.children.forEach(child => processItem(child, path));
    } else {
      // Create a regular file for items without children
      const weight = subIndex[currentFolder];
      subIndex[currentFolder]++;
      structure.push({
        id: item.id,
        path: `${path}.md`,
        content: `+++
title = "${item.title}"
weight = ${weight}
+++

${item.content}
`
      });
    }
  }

  chapterStructure.forEach(item => processItem(item));

  return structure;
}

function updateSyncStatus(id, success) {
  console.log('Updating sync status for:', id);
  const row = document.querySelector(`#chapterStructureContainer tr[data-id="${id}"]`);
  if (row) {
    const statusCell = row.querySelector('.sync-status');
    statusCell.innerHTML = success ? '&#x2705;' : '&#x274C;'; // Green tick or red cross
    statusCell.style.fontSize = '20px';
  }
}

async function processAndUploadImages(id, content, basePath) {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    let newContent = content;
    const uploadedImages = [];

    while ((match = imgRegex.exec(content)) !== null) {
        const oldImageUrl = match[1];
        const imageName = oldImageUrl.split('/').pop().split('?')[0];
        const imageBasePath = basePath.replace(/^content\//, '');
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const newImagePath = `static/images/${imageBasePath}/${id}-${randomDigits}-${imageName}`;
        const newImagePathInContent = newImagePath.replace(/^static/, '');
        console.log('Processing image:', oldImageUrl);

        try {
            const response = await fetch(oldImageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            console.log('Image downloaded, size:', blob.size, 'bytes');

            const base64data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = (error) => {
                    console.error('Error reading file:', error);
                    resolve(null);
                };
                reader.readAsDataURL(blob);
            });

            if (base64data) {
                uploadedImages.push({ path: newImagePath, content: base64data });
                newContent = newContent.replace(oldImageUrl, newImagePathInContent);
                console.log('Image processed successfully:', newImagePath);
            } else {
                console.error('Failed to convert image to base64:', oldImageUrl);
            }
        } catch (error) {
            console.error(`Error processing image ${oldImageUrl}:`, error);
        }
    }

    return { newContent, uploadedImages };
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadFromUrlParams();

    parseButtonElement = document.getElementById('parseButton');
    parseTableElement = document.getElementById('parseTable');
    githubSyncFormElement = document.getElementById('githubSyncForm');

    // Initially hide Parse button and GitHub sync form
    toggleParseAndSyncVisibility(false);

    document.getElementById('notionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const notionSecret = document.getElementById('notionSecret').value;
        const pageId = document.getElementById('pageId').value;
        const testMode = document.getElementById('testMode').checked;
        
        // Hide Parse button, parse table, and GitHub sync form before starting conversion
        toggleParseAndSyncVisibility(false);
        if (parseTableElement) parseTableElement.style.display = 'none';
        
        await convertNotionPage(notionSecret, pageId, testMode);
    });

    document.getElementById('copyButton').addEventListener('click', () => {
      const resultText = document.getElementById('result').textContent;
      navigator.clipboard.writeText(resultText).then(() => {
          alert('Copied to clipboard!');
      }).catch(err => {
          console.error('Failed to copy: ', err);
      });
    });

    document.getElementById('downloadButton').addEventListener('click', () => {
      const resultText = document.getElementById('result').textContent;
      const blob = new Blob([resultText], {type: 'text/markdown'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notion_page.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    document.getElementById('parseButton').addEventListener('click', () => {
        const markdownContent = document.getElementById('result').textContent;
        const parsedContent = parseMarkdown(markdownContent);
        console.log('Parsed Content:', parsedContent);
        const tableHtml = generateTableHtml(parsedContent);
        parseTableElement.innerHTML = '<h2>Chapter Structure</h2><div id="chapterStructureContainer">' + tableHtml + '</div>';
        parseTableElement.style.display = 'block';
        
        // Show the GitHub sync form after parsing
        toggleParseAndSyncVisibility(true);
    });

    // Modify the input event listener for the result element
    document.getElementById('result').addEventListener('input', function() {
        if (this.textContent.trim() === '') {
            toggleParseAndSyncVisibility(false);
            if (parseTableElement) parseTableElement.style.display = 'none';
        } else {
            toggleParseAndSyncVisibility(true);
        }
    });

    document.getElementById('syncButton').addEventListener('click', async () => {
        const githubToken = document.getElementById('githubToken').value;
        const githubRepo = document.getElementById('githubRepo').value;

        if (!githubToken || !githubRepo) {
            alert('Please enter both GitHub token and repo URL');
            return;
        }

        const github = new GitHubWrapper();
        github.init(githubToken, githubRepo);

        try {
            await github.deleteFolder('content');
            await github.deleteFolder('static/images');
            console.log('Existing content and images folders deleted or not found');

            const chapterStructure = Array.from(document.querySelectorAll('#parseTable tbody tr'));
            const restructuredChapterStructure = restructureChapterStructure(chapterStructure);
            const folderStructure = generateFolderStructure(restructuredChapterStructure);
            console.log('Folder structure:', folderStructure);

            for (const item of folderStructure) {
                try {
                    const basePath = item.path.split('/').slice(0, -1).join('/');
                    const { newContent, uploadedImages } = await processAndUploadImages(item.id, item.content, basePath);
                    
                    // Upload the content file with updated image paths
                    await github.createFile(item.path, newContent);
                    console.log(`Created: ${item.path}`);
                    updateSyncStatus(item.id, true);

                    // Upload the images
                    for (const image of uploadedImages) {
                        try {
                            console.log(`Uploading image: ${image.path}, size: ${image.content.length} characters`);
                            await github.createFile(image.path, image.content, true);
                            console.log(`Uploaded image: ${image.path}`);
                        } catch (error) {
                            console.error(`Error uploading image ${image.path}:`, error);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing item ${item.path}:`, error);
                    updateSyncStatus(item.id, false);
                }
            }

            setTimeout(() => {
                alert('GitHub sync completed');
            }, 1000);
        } catch (error) {
            console.error('Error during GitHub sync:', error);
            alert('Error during GitHub sync. Check console for details.');
        }
    });
});

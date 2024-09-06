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
let customConfig;

// Add this function
function toggleParseAndSyncVisibility(show) {
    if (parseButtonElement) {
        parseButtonElement.style.display = show ? 'block' : 'none';
        if (show) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    if (githubSyncFormElement && parseTableElement) {
        githubSyncFormElement.style.display = (show && parseTableElement.innerHTML.trim() !== '') ? 'block' : 'none';
    }
}

function extractPageId(input) {
  // Check if the input is a URL
  if (input.startsWith('http')) {
    const url = new URL(input);
    const pathSegments = url.pathname.split('-');
    return pathSegments[pathSegments.length - 1];
  }
  // If it's not a URL, assume it's already a page ID
  return input;
}

async function convertNotionPage(notionSecret, pageId) {
  const convertButton = document.getElementById('convertButton');
  const resultElement = document.getElementById('result');
  const resultActionsElement = document.getElementById('resultActions');
  const parseButtonElement = document.getElementById('parseButton');
  const parseTableElement = document.getElementById('parseTable');
  const testMode = document.getElementById('testMode').checked;
  const resultTitleElement = document.getElementById('resultTitle');
  const corsProxyUrl = document.getElementById('corsProxyUrl').value;
  const corsProxyToken = document.getElementById('corsProxyToken').value;

  // Update button text and disable it
  convertButton.textContent = 'Converting...';
  convertButton.disabled = true;

  // Show loading state
  resultElement.innerHTML = '<div class="loading-spinner"></div>';
  resultElement.style.display = 'flex';
  resultElement.style.justifyContent = 'center';
  resultElement.style.alignItems = 'center';
  resultTitleElement.style.display = 'none';
  resultActionsElement.style.display = 'none';
  toggleParseAndSyncVisibility(false);
  if (parseTableElement) parseTableElement.style.display = 'none';

  if (!notionSecret || !pageId) {
    resultElement.textContent = 'Error: Missing notion_secret or page_id';
    convertButton.textContent = 'Convert';
    convertButton.disabled = false;
    return;
  }

  // Extract page ID if it's a URL
  pageId = extractPageId(pageId);

  try {
    let result;
    const storedData = localStorage.getItem('notionMarkdown');

    if (testMode && storedData) {
        console.log("Test mode: Using stored data.");
        result = JSON.parse(storedData);
    } else {
        result = await window.getNotionPageMarkdown(notionSecret, pageId, corsProxyUrl, corsProxyToken);
        
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
    console.error("Error in convertNotionPage:", error);
    let errorMessage = "An error occurred while converting the Notion page.";
    if (error.message.includes("API token is invalid")) {
        errorMessage = "The Notion API token is invalid. Please check your token and try again.";
    } else if (error.status === 404) {
        errorMessage = "The specified Notion page could not be found. Please check the page ID and ensure the page is shared with your integration.";
    }
    resultElement.textContent = errorMessage;
    resultElement.style.display = 'block';
    resultTitleElement.style.display = 'none';
    resultActionsElement.style.display = 'none';
    toggleParseAndSyncVisibility(false);
    if (parseTableElement) parseTableElement.style.display = 'none';
  } finally {
    // Always reset the button text and enable it
    convertButton.textContent = 'Convert';
    convertButton.disabled = false;
  }
}

function loadFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const notionSecret = urlParams.get('notion_secret');
  const pageId = urlParams.get('page_id');
  const githubToken = urlParams.get('github_token');
  const githubRepo = urlParams.get('github_repo');
  const corsProxyUrl = urlParams.get('cors_proxy_url');
  const corsProxyToken = urlParams.get('cors_proxy_token');

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
  if (corsProxyUrl) {
    document.getElementById('corsProxyUrl').value = corsProxyUrl;
  }
  if (corsProxyToken) {
    document.getElementById('corsProxyToken').value = corsProxyToken;
  }
}

function generateTableHtml(parsedContent) {
  let tableHtml = '<table class="sync-table">';
  tableHtml += '<thead><tr><th>ID</th><th>Level</th><th>Title</th><th>Content Preview</th><th>Content</th><th>Status</th></tr></thead>';
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
          <td class="sync-status sync-status-cell">Pending</td>
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

function updateSyncStatus(id, status) {
  console.log('Updating sync status for:', id);
  const row = document.querySelector(`#chapterStructureContainer tr[data-id="${id}"]`);
  if (row) {
    const statusCell = row.querySelector('.sync-status');
    if (status === 'Success') {
      statusCell.innerHTML = '✅';
      statusCell.style.fontSize = ''; // Reset to original style
    } else if (status === 'Error') {
      statusCell.innerHTML = '❌';
      statusCell.style.fontSize = ''; // Reset to original style
    } else if (status === 'Preparing') {
      statusCell.textContent = 'Preparing...';
      statusCell.style.fontSize = ''; // Reset to original style
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (status === '✅ Prepared') {
      statusCell.textContent = status;
      statusCell.style.fontSize = '14px'; // Set font size to 14px only for this status
    } else {
      statusCell.textContent = status;
      statusCell.style.fontSize = ''; // Reset to original style
    }
  }
}

async function processAndUploadImages(id, content, basePath) {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    let newContent = content;
    const uploadedImages = [];
    const imagesToProcess = [];

    while ((match = imgRegex.exec(content)) !== null) {
        const oldImageUrl = match[1];
        const imageName = oldImageUrl.split('/').pop().split('?')[0];
        const imageBasePath = basePath.replace(/^content\//, '');
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const newImagePath = `static/images/${imageBasePath}/${id}-${randomDigits}-${imageName}`;
        const newImagePathInContent = newImagePath.replace(/^static/, '');
        
        imagesToProcess.push({
            oldImageUrl,
            newImagePath,
            newImagePathInContent
        });
    }

    // Too sad that chrome limits the number of concurrent connections to 6
    // Adjust this number based on your needs and system capabilities
    const concurrencyLimit = 10; 
    const queue = imagesToProcess.map((image, index) => ({ image, index }));
    const results = new Array(imagesToProcess.length);

    async function processImage({ image, index }) {
        try {
            const response = await fetch(image.oldImageUrl);
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
                uploadedImages.push({ path: image.newImagePath, content: base64data });
                newContent = newContent.replace(image.oldImageUrl, image.newImagePathInContent);
                console.log('Image processed successfully:', image.newImagePath);
                results[index] = { success: true, newImagePathInContent: image.newImagePathInContent };
            } else {
                console.error('Failed to convert image to base64:', image.oldImageUrl);
                results[index] = { success: false };
            }
        } catch (error) {
            console.error(`Error processing image ${image.oldImageUrl}:`, error);
            results[index] = { success: false };
        }
    }

    async function worker() {
        while (queue.length) {
            const item = queue.shift();
            await processImage(item);
        }
    }

    const workers = Array(concurrencyLimit).fill().map(worker);
    await Promise.all(workers);

    // Apply all successful replacements to newContent
    results.forEach(result => {
        if (result && result.success) {
            newContent = newContent.replace(result.oldImageUrl, result.newImagePathInContent);
        }
    });

    return { newContent, uploadedImages };
}

async function handleCustomConfiguration(content, github, uploadedImages) {
    if (!content) return [];

    const customImages = [];
    let currentDetails = '';
    let inInsideDetails = false;

    for (let i = 0; i < content.length; i++) {
        const line = content[i];
        if (line.includes('<summary>Custom Configuration</summary>')) {
            inInsideDetails = true;
            currentDetails = '<details>\n<summary>Custom Configuration</summary>\n';
        } else if (inInsideDetails && line.includes('</details>')) {
            currentDetails += '</details>';
            customImages.push(currentDetails);
            currentDetails = '';
        } else if (inInsideDetails) {
            currentDetails += line + '\n';
        }
    }

    return customImages;
}

async function uploadImage(github, imageName, line) {
    const match = line.match(/!\[.*?\]\((.*?)\)/);
    if (!match || !match[1]) {
        console.error(`No image URL found in line: ${line}`);
        return null;
    }
    const imageUrl = match[1];
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const base64data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
        
        const imagePath = `static/images/${imageName}`;
        const result = await github.createFile(imagePath, base64data, true);
        console.log(`Uploaded custom image: ${imagePath}`, result);
        return { path: imagePath, content: base64data };
    } catch (error) {
        console.error(`Error uploading custom image ${imageName}:`, error);
        return null;
    }
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
        console.log('Form submitted');
        const notionSecret = document.getElementById('notionSecret').value;
        const pageId = extractPageId(document.getElementById('pageId').value);
        document.getElementById('pageId').value = pageId;
        console.log('Calling convertNotionPage');
        await convertNotionPage(notionSecret, pageId);
        console.log('convertNotionPage completed');
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
        customConfig = parsedContent[0];
        const tableHtml = generateTableHtml(parsedContent);
        parseTableElement.innerHTML = '<h2>Chapter Structure</h2><div id="chapterStructureContainer">' + tableHtml + '</div>';
        parseTableElement.style.display = 'block';
        
        // Show the GitHub sync form after parsing
        if (githubSyncFormElement) {
            githubSyncFormElement.style.display = 'block';
            // Scroll the githubSyncForm into view
            githubSyncFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
        const syncButton = document.getElementById('syncButton');
        const syncStatus = document.getElementById('syncStatus');
        const originalButtonText = syncButton.textContent;
        syncButton.textContent = 'Syncing...';
        syncButton.disabled = true;
        syncStatus.style.display = 'flex';

        const githubToken = document.getElementById('githubToken').value;
        const githubRepo = document.getElementById('githubRepo').value;

        if (!githubToken || !githubRepo) {
            alert('Please enter both GitHub token and repo URL');
            syncButton.textContent = originalButtonText;
            syncButton.disabled = false;
            syncStatus.style.display = 'none';
            return;
        }

        const github = new GitHubWrapper();
        github.init(githubToken, githubRepo);

        try {
            syncButton.textContent = 'Preparing content...';
            const chapterStructure = Array.from(document.querySelectorAll('#parseTable tbody tr'));
            const uploadedImages = [];
            const customImages = await handleCustomConfiguration(customConfig.content, github, uploadedImages);
            const restructuredChapterStructure = restructureChapterStructure(chapterStructure);
            const folderStructure = generateFolderStructure(restructuredChapterStructure);
            console.log('Folder structure:', folderStructure);

            const filesToCreate = [];

            for (const item of folderStructure) {
                try {
                    updateSyncStatus(item.id, `Preparing`);
                    const basePath = item.path.split('/').slice(0, -1).join('/');
                    const { newContent, uploadedImages: itemUploadedImages } = await processAndUploadImages(item.id, item.content, basePath);
                    
                    filesToCreate.push({ path: item.path, content: newContent });
                    console.log(`Prepared: ${item.path}`);
                    
                    uploadedImages.push(...itemUploadedImages);
                    updateSyncStatus(item.id, `✅ Prepared`);
                } catch (error) {
                    console.error(`Error processing item ${item.path}:`, error);
                    updateSyncStatus(item.id, 'Error');
                }
            }

            for (const image of uploadedImages) {
                filesToCreate.push({ path: image.path, content: image.content, isBinary: true });
                console.log(`Prepared image: ${image.path}`);
            }

            syncButton.textContent = 'Updating GitHub...';
            await github.deleteAndCreateFiles(['content', 'static'], filesToCreate);
            console.log('All files updated');

            folderStructure.forEach(item => updateSyncStatus(item.id, 'Success'));

            syncButton.textContent = 'Sync Complete';
            syncButton.classList.add('sync-complete');
            syncStatus.innerHTML = '<p>✅ Sync Complete!</p><p>&nbsp;Your content has been successfully uploaded to GitHub.</p>';
            syncStatus.style.display = 'flex';
            syncStatus.classList.add('sync-success');
            syncButton.textContent = originalButtonText;
            syncButton.disabled = false;

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error('Error during GitHub sync:', error);
            alert('Error during GitHub sync. Check console for details.');
            syncButton.textContent = originalButtonText;
            syncButton.disabled = false;
            syncStatus.style.display = 'none';
        }
    });
});

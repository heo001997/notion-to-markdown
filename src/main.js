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

async function convertNotionPage(notionSecret, pageId) {
  const resultElement = document.getElementById('result');
  const resultActionsElement = document.getElementById('resultActions');
  const parseButtonElement = document.getElementById('parseButton');
  const parseTableElement = document.getElementById('parseTable');
  const testMode = document.getElementById('testMode').checked;

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
      
      const { lastEditedTime, markdown } = result;
      
      if (lastEditedTime) {
          const formattedDate = formatDate(lastEditedTime);
          document.getElementById('lastEdited').textContent = `Last edited: ${formattedDate}`;
      } else {
          document.getElementById('lastEdited').textContent = '';
      }
      
      resultElement.textContent = markdown;
      
      if (markdown && markdown.trim() !== '') {
          resultElement.style.display = 'block';
          resultActionsElement.style.display = 'flex';
          parseButtonElement.style.display = 'block';
          
          let parseButtonContainer = document.getElementById('parseButtonContainer');
          if (!parseButtonContainer) {
              parseButtonContainer = document.createElement('div');
              parseButtonContainer.id = 'parseButtonContainer';
              parseButtonElement.parentNode.insertBefore(parseButtonContainer, parseButtonElement);
          }
          
          parseButtonContainer.appendChild(parseButtonElement);
      } else {
          resultElement.style.display = 'none';
          resultActionsElement.style.display = 'none';
          parseButtonElement.style.display = 'none';
          parseTableElement.style.display = 'none';
      }
  } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
      resultElement.style.display = 'block';
      resultActionsElement.style.display = 'none';
      parseButtonElement.style.display = 'none';
      parseTableElement.style.display = 'none';
  }
}

function loadFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const notionSecret = urlParams.get('notion_secret');
  const pageId = urlParams.get('page_id');
  
  if (notionSecret) document.getElementById('notionSecret').value = notionSecret;
  if (pageId) document.getElementById('pageId').value = pageId;
}

function generateTableHtml(parsedContent) {
  let tableHtml = '<table class="sync-table">';
  tableHtml += '<thead><tr><th>ID</th><th>Level</th><th>Title</th><th>Content Preview</th><th>Content</th><th>Synced</th></tr></thead>';
  tableHtml += '<tbody>';

  let id = 1;
  parsedContent.forEach(section => {
      if (section.type.startsWith('h') && parseInt(section.type[1]) <= 5) {
          const level = section.type[1];
          const title = section.title;
          const contentPreview = section.content.join(' ').substring(0, 100) + '...';
          const fullContent = section.content.join('\n');
          
          tableHtml += `<tr>
              <td>${id}</td>
              <td>H${level}</td>
              <td>${title}</td>
              <td>${contentPreview}</td>
              <td><textarea class="content-textarea" readonly>${fullContent}</textarea></td>
              <td><input type="checkbox" class="sync-checkbox" id="sync-${id}"></td>
          </tr>`;
          id++;
      }
  });

  tableHtml += '</tbody></table>';
  return tableHtml;
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadFromUrlParams();

    // Hide Parse button and parse table initially
    const parseButtonElement = document.getElementById('parseButton');
    const parseTableElement = document.getElementById('parseTable');
    parseButtonElement.style.display = 'none';
    parseTableElement.style.display = 'none';

    // Create parseButtonContainer if it doesn't exist
    let parseButtonContainer = document.getElementById('parseButtonContainer');
    if (!parseButtonContainer) {
        parseButtonContainer = document.createElement('div');
        parseButtonContainer.id = 'parseButtonContainer';
        parseButtonElement.parentNode.insertBefore(parseButtonContainer, parseButton);
        parseButtonContainer.appendChild(parseButton);
    }

    document.getElementById('notionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const notionSecret = document.getElementById('notionSecret').value;
        const pageId = document.getElementById('pageId').value;
        const testMode = document.getElementById('testMode').checked;
        
        // Hide Parse button and parse table before starting conversion
        document.getElementById('parseButton').style.display = 'none';
        document.getElementById('parseTable').style.display = 'none';
        
        convertNotionPage(notionSecret, pageId, testMode);
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
      const parseTableElement = document.getElementById('parseTable');
      const parsedContent = parseMarkdown(markdownContent);
      console.log('Parsed Content:', parsedContent);
      const tableHtml = generateTableHtml(parsedContent);
      parseTableElement.innerHTML = '<h2>Chapter Structure</h2><div id="chapterStructureContainer">' + tableHtml + '</div>';
      parseTableElement.style.display = 'block';
    });

    // Add this new event listener
    document.getElementById('result').addEventListener('input', function() {
        const parseButtonElement = document.getElementById('parseButton');
        const parseTableElement = document.getElementById('parseTable');
        if (this.textContent.trim() === '') {
            parseButtonElement.style.display = 'none';
            parseTableElement.style.display = 'none';
        } else {
            parseButtonElement.style.display = 'block';
        }
    });
});

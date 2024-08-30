import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

// Define the main function
async function getNotionPageMarkdown(notion_secret, raw_target_page_id) {
  // Validate the inputs
  if (!notion_secret) {
    throw new Error("Missing notion_secret");
  }
  if (!raw_target_page_id || !/^[a-f0-9]{32}$/.test(raw_target_page_id)) {
    throw new Error("Invalid page_id");
  }

  // Parse the target_page_id
  const target_page_id = raw_target_page_id.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
  console.log("Formatted target_page_id:", target_page_id);

  const notion = new Client({
    auth: notion_secret,
    fetch: (url, options) => {
      return fetch(CORS_PROXY + url, {
        ...options,
        headers: {
          ...options.headers,
          "Origin": window.location.origin
        }
      });
    }
  });

  let pageResponse;
  try {
    pageResponse = await notion.pages.retrieve({ page_id: target_page_id });
  } catch (error) {
    if (error.status === 404) {
      return {
        error: `Could not find block with ID: ${target_page_id}. Make sure the relevant pages and databases are shared with your integration.`
      };
    }
    // For other errors, throw the original error
    throw error;
  }
  const lastEditedTime = pageResponse.last_edited_time;

  // Check localStorage for existing data
  const storedData = localStorage.getItem('notionMarkdown');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    if (parsedData.lastEditedTime === lastEditedTime) {
      console.log("No changes detected. Using stored data.");
      return parsedData;
    }
  }

  // Initialize NotionToMarkdown
  const n2m = new NotionToMarkdown({ notionClient: notion });

  try {
    const mdblocks = await n2m.pageToMarkdown(target_page_id);
    console.log("mdblocks: ", mdblocks);
    const mdString = n2m.toMarkdownString(mdblocks);
    console.log("mdString: ", mdString);
    
    const result = {
      lastEditedTime: lastEditedTime,
      markdown: mdString.parent
    };
    // Store in localStorage
    localStorage.setItem('notionMarkdown', JSON.stringify(result));

    return result;
  } catch (error) {
    console.error("Error accessing Notion page:", error.message);
    throw error;
  }
}

// Expose the function to the global scope (window object)
window.getNotionPageMarkdown = getNotionPageMarkdown;
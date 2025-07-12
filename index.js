#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as cheerio from "cheerio";

const server = new McpServer({
  name: "mcp-web-browsing-server",
  version: "1.0.0"
});

// Schema for fetching webpage content
const fetchWebpageSchema = {
  url: z.string().url().describe("The URL of the webpage to fetch"),
  includeImages: z.boolean().optional().describe("Whether to include image URLs in the response"),
  maxLength: z.number().optional().describe("Maximum length of text content to return (default: 5000)")
};

// Schema for extracting specific elements
const extractElementsSchema = {
  url: z.string().url().describe("The URL of the webpage to fetch"),
  selector: z.string().describe("CSS selector to target specific elements (e.g., 'h1', '.article-content', '#main')"),
  attribute: z.string().optional().describe("Specific attribute to extract (e.g., 'href', 'src', 'alt')")
};

// Schema for getting page metadata
const getMetadataSchema = {
  url: z.string().url().describe("The URL of the webpage to analyze")
};

// Function to fetch and parse webpage content
async function fetchWebpage({ url, includeImages = false, maxLength = 5000 }) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, footer, aside').remove();

    // Extract main content
    let mainContent = '';
    const contentSelectors = ['main', 'article', '.content', '.post-content', '.entry-content', 'body'];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        mainContent = element.text().trim();
        break;
      }
    }

    if (!mainContent) {
      mainContent = $('body').text().trim();
    }

    // Clean up whitespace
    mainContent = mainContent.replace(/\s+/g, ' ').trim();
    
    // Truncate if too long
    if (mainContent.length > maxLength) {
      mainContent = mainContent.substring(0, maxLength) + '...';
    }

    // Extract images if requested
    let images = [];
    if (includeImages) {
      $('img').each((i, elem) => {
        const src = $(elem).attr('src');
        const alt = $(elem).attr('alt') || '';
        if (src) {
          // Convert relative URLs to absolute
          const imageUrl = new URL(src, url).href;
          images.push({ src: imageUrl, alt });
        }
      });
    }

    // Get page title
    const title = $('title').text() || '';

    const result = {
      title,
      content: mainContent,
      url,
      wordCount: mainContent.split(' ').length,
      ...(includeImages && { images })
    };

    return {
      content: [{ 
        type: "text", 
        text: `# ${title}\n\n**URL:** ${url}\n**Word Count:** ${result.wordCount}\n\n## Content\n\n${mainContent}${includeImages && images.length > 0 ? `\n\n## Images Found\n${images.map(img => `- ![${img.alt}](${img.src})`).join('\n')}` : ''}`
      }]
    };

  } catch (error) {
    throw new Error(`Failed to fetch webpage: ${error.message}`);
  }
}

// Function to extract specific elements using CSS selectors
async function extractElements({ url, selector, attribute }) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const elements = [];
    $(selector).each((i, elem) => {
      if (attribute) {
        const value = $(elem).attr(attribute);
        if (value) {
          // Convert relative URLs to absolute for link attributes
          if (attribute === 'href' || attribute === 'src') {
            elements.push(new URL(value, url).href);
          } else {
            elements.push(value);
          }
        }
      } else {
        elements.push($(elem).text().trim());
      }
    });

    return {
      content: [{
        type: "text",
        text: `# Elements extracted from ${url}\n\n**Selector:** \`${selector}\`${attribute ? `\n**Attribute:** \`${attribute}\`` : ''}\n**Found:** ${elements.length} elements\n\n${elements.map((elem, i) => `${i + 1}. ${elem}`).join('\n')}`
      }]
    };

  } catch (error) {
    throw new Error(`Failed to extract elements: ${error.message}`);
  }
}

// Function to get page metadata
async function getMetadata({ url }) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = {
      title: $('title').text() || '',
      description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      publishedTime: $('meta[property="article:published_time"]').attr('content') || $('meta[name="date"]').attr('content') || '',
      modifiedTime: $('meta[property="article:modified_time"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      ogUrl: $('meta[property="og:url"]').attr('content') || '',
      twitterCard: $('meta[name="twitter:card"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
      language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || '',
      robots: $('meta[name="robots"]').attr('content') || ''
    };

    // Filter out empty values
    const filteredMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([_, value]) => value && value.trim() !== '')
    );

    return {
      content: [{
        type: "text",
        text: `# Metadata for ${url}\n\n${Object.entries(filteredMetadata).map(([key, value]) => `**${key}:** ${value}`).join('\n')}`
      }]
    };

  } catch (error) {
    throw new Error(`Failed to get metadata: ${error.message}`);
  }
}

// Register the tools
server.registerTool("fetch_webpage", {
  title: "Fetch Webpage Content",
  description: "Fetch and extract the main content from a webpage with optional image extraction",
  inputSchema: fetchWebpageSchema,
}, fetchWebpage);

server.registerTool("extract_elements", {
  title: "Extract Specific Elements",
  description: "Extract specific HTML elements from a webpage using CSS selectors",
  inputSchema: extractElementsSchema,
}, extractElements);

server.registerTool("get_metadata", {
  title: "Get Page Metadata",
  description: "Extract metadata (title, description, Open Graph tags, etc.) from a webpage",
  inputSchema: getMetadataSchema,
}, getMetadata); 

const transport = new StdioServerTransport();
await server.connect(transport); 

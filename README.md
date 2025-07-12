# Web Browsing MCP Server

[![npm version](https://badge.fury.io/js/@leonardocerv%2Fweb-browsing-mcp.svg)](https://badge.fury.io/js/@leonardocerv%2Fweb-browsing-mcp)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

This tool lets your AI assistant browse the web and pull information from websites automatically. It's an MCP (Model Context Protocol) server that helps AI assistants read web pages, extract specific content, and get useful information without you having to copy-paste everything manually.

Think of it as giving your AI the ability to visit websites and read them just like you would, but much faster and more efficiently.

## What it does

**Clean content extraction**
- Gets the main content from any webpage (automatically filters out ads, navigation menus, etc.)
- Can include images and their descriptions if you want
- You can limit how much content it grabs

**Target specific parts of pages**
- Find exactly what you're looking for using CSS selectors (like `.title` or `#main`)
- Extract specific attributes like links, image sources, or text
- Automatically converts relative URLs to full URLs

**Get page information**
- Page titles, descriptions, and metadata
- Social media preview info (Open Graph, Twitter Cards)
- Author info, publication dates, and language
- SEO-related data

## Getting started

**Option 1: Install from npm (easiest)**
```bash
npm install -g @leonardocerv/web-browsing-mcp
```

**Option 2: Set up for development**
```bash
git clone https://github.com/LeonardoCerv/web-browsing-MCP.git
cd web-browsing-MCP
npm install
```

## Setting it up with Claude

You'll need to add this to your Claude Desktop configuration file so Claude knows how to use it.

**Find your config file:**
- **macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**If you installed via npm:**
```json
{
  "mcpServers": {
    "web-browsing": {
      "command": "npx",
      "args": ["@leonardocerv/web-browsing-mcp"]
    }
  }
}
```

**If you're developing/testing:**
```json
{
  "mcpServers": {
    "web-browsing": {
      "command": "node",
      "args": ["/absolute/path/to/web-browsing-MCP/index.js"]
    }
  }
}
```

After adding this, restart Claude Desktop and you'll be good to go.

## Available tools

### `fetch_webpage`
Gets clean, readable content from any webpage.

**What you need to provide:**
- `url` (required): The webpage you want to read
- `includeImages` (optional): Set to true if you want image URLs too
- `maxLength` (optional): Limit how much text to get (default is 5000 characters)

### `extract_elements`
Finds specific parts of a webpage using CSS selectors.

**What you need to provide:**
- `url` (required): The webpage to look at
- `selector` (required): CSS selector to find what you want (like `h1`, `.article-title`, or `a[href]`)
- `attribute` (optional): If you want a specific attribute like `href`, `src`, or `alt`

### `get_metadata`
Gets all the behind-the-scenes information about a webpage.

**What you need to provide:**
- `url` (required): The webpage to analyze

## Examples

**Read an article cleanly:**
```json
{
  "tool": "fetch_webpage",
  "arguments": {
    "url": "https://example.com/article",
    "includeImages": true,
    "maxLength": 3000
  }
}
```

**Get all the links from Hacker News:**
```json
{
  "tool": "extract_elements", 
  "arguments": {
    "url": "https://news.ycombinator.com",
    "selector": ".titleline > a",
    "attribute": "href"
  }
}
```

**Get all the info about a page:**
```json
{
  "tool": "get_metadata",
  "arguments": {
    "url": "https://example.com"
  }
}
```

## What you can use this for

- **Research**: Read multiple articles without opening a bunch of browser tabs
- **Link collection**: Pull specific links, images, or data from pages  
- **SEO analysis**: Check page structure and metadata
- **Content monitoring**: Keep track of headlines, articles, and content changes
- **Data extraction**: Use CSS selectors to grab exactly what you need
- **Asset gathering**: Collect image URLs and descriptions for projects

## How it works

This tool is built with solid, reliable libraries:

- **Model Context Protocol SDK**: The official framework for connecting with AI assistants
- **Cheerio**: Server-side HTML parsing (like jQuery but for Node.js)
- **URL handling**: Automatically converts relative URLs to full URLs
- **Error handling**: Won't crash if something goes wrong
- **Web standards**: Uses proper headers and follows web etiquette

## Dependencies

The main libraries this project uses:

- **[@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)** - Official MCP framework
- **[cheerio](https://www.npmjs.com/package/cheerio)** - HTML parsing and manipulation
- **[zod](https://www.npmjs.com/package/zod)** - Input validation

## Running the server

**For development:**
```bash
npm run dev
```

**For production:**
```bash
npm start
```

The server communicates through stdio and works with any AI assistant that supports MCP.

## Error handling & security

**Error handling:**
- Validates URLs and handles bad requests gracefully
- Handles network timeouts and connection issues
- Deals with broken HTML and missing elements
- Gives clear error messages without crashing

**Security & best practices:**
- Uses standard browser headers to avoid getting blocked
- Doesn't store credentials or sensitive data
- Follows web scraping etiquette
- Rate limiting is up to you to manage

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Links

- **npm package**: [@leonardocerv/web-browsing-mcp](https://www.npmjs.com/package/@leonardocerv/web-browsing-mcp)
- **GitHub Repository**: [LeonardoCerv/web-browsing-MCP](https://github.com/LeonardoCerv/web-browsing-MCP)
- **Issues**: [Report bugs or request features](https://github.com/LeonardoCerv/web-browsing-MCP/issues)

---

Give your AI assistant the ability to browse the web!

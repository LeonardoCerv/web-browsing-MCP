# Web Browsing MCP Server

This is a simple tool that lets AI assistants browse the web and pull content from websites. Instead of you having to manually copy and paste stuff from web pages, your AI can do it for you.

It's basically like giving your AI assistant a web browser that can read pages and grab exactly what you need from them.

## What it does

### Get webpage content
- Grabs the main text from any website
- Removes ads, menus, and other clutter
- Can also get images if you want them
- You can set how much content to grab (so you don't get a novel)

### Extract specific parts
- Want just the links from a page? Or just the images? No problem
- You tell it what to look for using CSS selectors (like `.title` or `#main`)
- It figures out the full URLs even if the page uses shortcuts
- Great for getting specific info without reading the whole page

### Get page info
- Finds the page title, description, author, etc.
- Gets social media preview info (Open Graph stuff)
- Pulls out SEO data like keywords and language
- Only shows you the useful stuff, skips empty fields

## Setup

### Option 1: Install from npm (when published)
```bash
npx @leonardocerv/web-browsing-mcp
```

### Option 2: Development setup
Clone this repository and run:

```bash
npm install
```

That's it. All the dependencies will be installed automatically.

## Configuration

### For published package
Add this to your Claude Desktop configuration:

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

### For development
Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "web-browsing": {
      "command": "node",
      "args": ["/path/to/your/web-browsing-MCP/index.js"]
    }
  }
}
```

## How to use it

This works with any AI assistant that supports MCP (Model Context Protocol). The AI can call these functions to browse the web for you.

### Examples

**Get content from a webpage:**
```json
{
  "tool": "fetch_webpage",
  "arguments": {
    "url": "https://example.com",
    "includeImages": true,
    "maxLength": 3000
  }
}
```

**Extract specific elements:**
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

**Get page metadata:**
```json
{
  "tool": "get_metadata",
  "arguments": {
    "url": "https://example.com"
  }
}
```

## What you can do with this

- **Research**: Read multiple articles without opening tons of browser tabs
- **Get links**: Extract all links from a page or just specific ones
- **Collect images**: Get image URLs and descriptions for projects
- **SEO analysis**: See how pages are set up for search engines
- **Monitor news**: Keep track of headlines and articles
- **Data collection**: Use CSS selectors to grab specific information

## Technical details

If you're curious about how it works:

- Uses the Model Context Protocol SDK for the framework
- Uses Cheerio library to parse HTML (it's like jQuery but for servers)
- Converts relative URLs to full URLs automatically  
- Sends proper browser headers so websites don't block it
- Cleans up content by removing navigation and styling
- Has error handling so it won't crash

## Dependencies

These are the main libraries it uses:
- `@modelcontextprotocol/sdk` - The MCP framework
- `cheerio` - HTML parsing (like jQuery for Node.js)  
- `zod` - Input validation

## Running it

```bash
node index.js
```

It runs through stdio, which means it works with any MCP-compatible AI assistant out of the box.

## Error handling

The server handles common problems gracefully:

- Bad URLs - tells you nicely instead of crashing
- Network issues - handles connection problems  
- Broken HTML - the parser is forgiving
- Missing elements - lets you know when something isn't found
- Rate limiting - that's between you and the website

## Security

- Uses standard browser headers
- Doesn't store any credentials  
- Follows normal web etiquette
- You're responsible for rate limiting

That's it! Simple web browsing for AI assistants.

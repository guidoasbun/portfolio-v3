# MCP Setup Guide for Portfolio Development

## Overview

This guide helps you set up Model Context Protocol (MCP) servers that will enhance your portfolio development workflow with Claude Code.

## Recommended MCPs for Your Portfolio Project

### 1. **Memory MCP** (High Priority)

**Purpose**: Store project context, decisions, and progress across development sessions

**Benefits for your project**:

- Remember component patterns and architecture decisions
- Track completed roadmap tasks
- Store Firebase schema decisions
- Remember Three.js performance optimizations

**Setup**:

```bash
npm install @modelcontextprotocol/server-memory
```

### 2. **Filesystem MCP** (High Priority)

**Purpose**: Enhanced file operations with better context understanding

**Benefits for your project**:

- Batch component creation
- Asset optimization
- Directory structure management
- File watching for development

**Setup**:

```bash
npm install @modelcontextprotocol/server-filesystem
```

### 3. **GitHub MCP** (High Priority)

**Purpose**: Project management and repository operations

**Benefits for your project**:

- Convert roadmap tasks to GitHub issues
- Manage branches for feature development
- Automate PR workflows
- Track project milestones

**Setup**:

```bash
npm install @modelcontextprotocol/server-github
```

### 4. **Playwright MCP** (Medium Priority)

**Purpose**: Automated testing and browser interactions

**Benefits for your project**:

- Test 3D interactions and performance
- Cross-browser compatibility testing
- Responsive design verification
- Admin dashboard workflow testing

**Setup**:

```bash
npm install @modelcontextprotocol/server-playwright
```

### 5. **Fetch MCP** (Medium Priority)

**Purpose**: API testing and external service integration

**Benefits for your project**:

- Test Firebase API endpoints
- Monitor API performance
- Debug external service integrations
- Test contact form submissions

**Setup**:

```bash
npm install @modelcontextprotocol/server-fetch
```

### 6. **SQLite MCP** (Optional)

**Purpose**: Local development database for testing

**Benefits for your project**:

- Test database schemas locally before Firebase
- Seed test data
- Migration testing
- Offline development

**Setup**:

```bash
npm install @modelcontextprotocol/server-sqlite
```

## Claude Desktop Configuration

### Step 1: Locate Configuration File

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 2: Configure MCPs

Create or update your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_STORAGE_PATH": "/Users/rodrigo/code/portfolio/.mcp-memory"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/rodrigo/code/portfolio"
      ],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {}
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "env": {}
    },
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "/Users/rodrigo/code/portfolio/dev.db"
      ],
      "env": {}
    }
  }
}
```

### Step 3: Environment Variables Setup

Create a `.env.local` file in your project root:

```bash
# GitHub Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here

# MCP Memory Storage
MCP_MEMORY_STORAGE_PATH=/Users/rodrigo/code/portfolio/.mcp-memory

# Database for local testing
SQLITE_DB_PATH=/Users/rodrigo/code/portfolio/dev.db
```

## GitHub Personal Access Token Setup

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with these scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `admin:org` (if working with organization repos)
3. Copy the token to your `.env.local` file

## Testing MCP Setup

### Test Memory MCP

```bash
# This will be available in Claude Code
# Ask Claude to remember project decisions
# Example: "Remember that we're using glass morphism design with backdrop-blur-md"
```

### Test Filesystem MCP

```bash
# Claude can now perform advanced file operations
# Example: "Create a components directory structure for the Three.js components"
```

### Test GitHub MCP

```bash
# Claude can now interact with your GitHub repository
# Example: "Create issues from the roadmap tasks in phase 1"
```

### Test Playwright MCP

```bash
# Initialize Playwright in your project
npx playwright install
# Claude can now write and run automated tests
```

## Project-Specific MCP Usage Patterns

### For Development Workflow

1. **Memory MCP**: Store component architecture decisions
2. **Filesystem MCP**: Create batch component files
3. **GitHub MCP**: Manage feature branches and issues

### For Testing

1. **Playwright MCP**: Test Three.js performance across browsers
2. **Fetch MCP**: Test API endpoints
3. **SQLite MCP**: Create test data scenarios

### For Deployment

1. **GitHub MCP**: Manage release workflows
2. **Fetch MCP**: Monitor production APIs
3. **Memory MCP**: Remember deployment configurations

## MCP Usage Guidelines

### Memory MCP Best Practices

- Store architectural decisions with context
- Remember performance optimization choices
- Track component patterns and conventions
- Store Firebase schema decisions

**Example Commands**:

- "Remember that we use dynamic imports for all Three.js components"
- "Store the glass morphism color palette: bg-white/10, border-white/20"
- "Remember that we optimize 3D performance with useThreePerformance hook"

### Filesystem MCP Best Practices

- Use for batch operations
- Maintain consistent file structures
- Optimize asset management

**Example Commands**:

- "Create all the UI components from the roadmap Phase 2"
- "Organize assets by type in the public directory"
- "Set up the admin directory structure"

### GitHub MCP Best Practices

- Create issues from roadmap tasks
- Manage feature branches systematically
- Track milestones and progress

**Example Commands**:

- "Create GitHub issues for all Phase 1 tasks"
- "Create a feature branch for Three.js integration"
- "Set up project milestones for each development phase"

## Troubleshooting

### Common Issues

1. **MCP not appearing in Claude**
   - Restart Claude Desktop after configuration changes
   - Check JSON syntax in configuration file
   - Verify file paths are correct

2. **GitHub MCP authentication fails**
   - Verify token has correct permissions
   - Check token is not expired
   - Ensure token is properly set in environment

3. **Filesystem MCP permission errors**
   - Check directory permissions
   - Ensure Claude has access to project directory
   - Verify paths in configuration

4. **Memory MCP not persisting**
   - Check storage path exists and is writable
   - Verify environment variable is set correctly

### Performance Considerations

- **Memory usage**: MCPs consume additional memory
- **Startup time**: More MCPs = longer Claude startup
- **Network requests**: GitHub and Fetch MCPs require internet

### Security Notes

- Never commit GitHub tokens to version control
- Use environment variables for sensitive data
- Regularly rotate access tokens
- Review MCP permissions periodically

## Advanced Configuration

### Custom MCP Development

For project-specific needs, you can create custom MCPs:

```typescript
// Example: Portfolio-specific MCP for Firebase operations
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server(
  { name: "portfolio-firebase", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Add custom tools for Firebase operations
```

### Integration with Development Workflow

1. **Pre-commit hooks**: Use MCPs to validate code
2. **CI/CD integration**: Leverage GitHub MCP for automation
3. **Performance monitoring**: Use Fetch MCP for API monitoring

## Next Steps

1. Install and configure the recommended MCPs
2. Test each MCP with simple commands
3. Create project-specific memory entries
4. Set up GitHub integration for roadmap management
5. Configure Playwright for testing workflows

This setup will significantly enhance your development experience with Claude Code, providing context awareness, automation capabilities, and comprehensive testing tools for your portfolio project.

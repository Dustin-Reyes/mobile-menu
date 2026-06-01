# SEO Quick Setup Guide

This guide helps you quickly configure the SEO system for your new project.

## ⚡ Quick Setup (5 Minutes)

### Option 1: Interactive Setup Script (Recommended)

Run the interactive setup script for guided configuration:

```bash
yarn seo:setup
```

This will guide you through:

- ✅ Project information (name, description, URL)
- ✅ Organization details (name, contact, social media)
- ✅ SEO settings (Twitter handle, Open Graph image)
- ✅ Page-specific SEO (home page, demo page)
- ✅ Automatic configuration file generation

The script will:

- Show current values (if any)
- Validate inputs (URLs, emails, Twitter handles)
- Create a backup of your current config
- Generate the complete configuration file
- Provide next steps and testing instructions

### Option 2: Manual Configuration

If you prefer to configure manually, edit `src/config/project.js`:

```javascript
export const PROJECT_CONFIG = {
  name: 'Your Project Name', // 🔄 Change this
  description: 'Your project description', // 🔄 Change this

  url: {
    production: 'https://yourdomain.com', // 🔄 Change this
    development: 'http://localhost:5173',
  },

  organization: {
    name: 'Your Company Name', // 🔄 Change this
    url: 'https://yourcompany.com', // 🔄 Change this
    contact: {
      email: 'contact@yourcompany.com', // 🔄 Change this
    },
    social: {
      twitter: 'https://twitter.com/yourhandle', // 🔄 Change this
      github: 'https://github.com/yourorg', // 🔄 Change this
    },
  },

  seo: {
    twitter: '@yourhandle', // 🔄 Change this
    image: 'https://yourdomain.com/og-image.png', // 🔄 Add your image
  },
};
```

### 2. Update Page-Specific SEO

In the same file, update the pages section:

```javascript
pages: {
  home: {
    title: 'Your Service | Your Brand',  // 🔄 Change this
    description: 'Start your next project with our amazing service', // 🔄 Change this
    keywords: ['your', 'keywords', 'here'], // 🔄 Change this
  },
  demo: {
    title: 'Demo | Your Brand',         // 🔄 Change this
    description: 'See our service in action', // 🔄 Change this
    keywords: ['demo', 'showcase', 'preview'], // 🔄 Change this
  },
},
```

### 3. Add Your Images

1. **Open Graph Image**: Add a 1200x630px image at `/public/og-image.png`
2. **Favicon**: Update `/public/favicon.svg` with your logo
3. **Additional Icons**: Add `/public/favicon-192.png` and `/public/favicon-512.png`

### 4. Test Your SEO

```bash
# Start development server
yarn dev

# Test static files
curl http://localhost:5173/sitemap.xml
curl http://localhost:5173/robots.txt
curl http://localhost:5173/manifest.json
```

### 5. Verify in Browser

1. Open your site in browser
2. View page source (Ctrl+U or Right-click → View Page Source)
3. Check for meta tags, Open Graph tags, and structured data
4. Test social sharing with Facebook Debugger

## 🎯 Done!

Your SEO is now configured! The system will automatically:

- Generate proper meta tags for each page
- Create Open Graph and Twitter Card tags
- Include structured data for rich snippets
- Serve sitemap and robots.txt
- Provide PWA manifest

## 📚 Need More Help?

- **[Complete SEO Guide](SEO_GUIDE.md)** - Detailed documentation
- **[Development Workflow](DEV_WORKFLOW_INSTRUCTIONS.md)** - Team processes
- **[Getting Started](GETTING_STARTED.md)** - Project setup

## 🔧 Advanced Configuration

For more advanced SEO customization, see the [SEO Guide](SEO_GUIDE.md#customization-guide).

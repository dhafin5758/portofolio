# Cybersecurity Portfolio Website

A minimalist, professional dark-themed cybersecurity portfolio website built with Tailwind CSS, featuring dynamic markdown write-up rendering.

## Features

✨ **Key Features:**
- 🎨 Minimalist dark cybersecurity theme
- 📝 Dynamic markdown write-up rendering
- 🔍 Category filtering for write-ups
- 📱 Fully responsive design
- 🎯 Smooth navigation and animations
- 💻 Syntax highlighting for code blocks

## Tech Stack

- **HTML5** - Structure
- **Tailwind CSS** - Styling framework (via CDN)
- **Vanilla JavaScript** - Application logic
- **Marked.js** - Markdown parsing
- **Highlight.js** - Code syntax highlighting

## Project Structure

```
portofolio/
├── index.html              # Main HTML file
├── src/
│   ├── style.css          # Custom CSS styles
│   ├── app.js             # Main application logic
│   └── writeups.js        # Write-ups configuration
├── writeups/              # Markdown write-up files
│   └── sample-writeup.md
└── README.md
```

## Getting Started

### Viewing the Website

Simply open `index.html` in a modern web browser. No build process or server required!

```bash
# Option 1: Open directly
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux

# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then navigate to http://localhost:8000
```

## Adding Your Own Write-ups

### Step 1: Create a Markdown File

Create a new `.md` file in the `writeups/` directory:

```bash
writeups/my-awesome-writeup.md
```

### Step 2: Write Your Content

Use standard markdown syntax:

```markdown
# My Awesome CTF Challenge

## Overview
Description of the challenge...

## Exploitation
```python
# Your exploit code
print("Hello, World!")
```

## Conclusion
Summary of what you learned...
```

### Step 3: Register the Write-up

Add an entry to `src/writeups.js`:

```javascript
const writeups = [
    {
        id: 'my-awesome-writeup',
        title: 'My Awesome CTF Challenge',
        description: 'A brief description of the write-up',
        date: '2025-12-22',
        category: 'web',  // Options: web, pwn, crypto, forensics
        tags: ['Tag1', 'Tag2', 'Tag3'],
        file: 'writeups/my-awesome-writeup.md'
    },
    // ... other write-ups
];
```

### Step 4: Reload the Page

Refresh your browser to see the new write-up appear in the portfolio!

## Supported Markdown Features

- ✅ Headings (H1-H6)
- ✅ Bold, italic, strikethrough
- ✅ Code blocks with syntax highlighting
- ✅ Inline code
- ✅ Lists (ordered and unordered)
- ✅ Blockquotes
- ✅ Links
- ✅ Images
- ✅ Tables

## Customization

### Changing Colors

Edit the Tailwind config in `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'cyber-dark': '#0a0e27',      // Background
                'cyber-blue': '#00d4ff',      // Primary accent
                'cyber-purple': '#9d4edd',    // Secondary accent
                // ... customize as needed
            }
        }
    }
}
```

### Modifying Sections

Edit the HTML sections in `index.html`:
- **Home**: Hero section with introduction
- **Write-ups**: Showcase your CTF write-ups
- **About**: Your background and skills
- **Contact**: Social links and contact info

### Adding Categories

To add new write-up categories:

1. Update the filter buttons in `index.html`
2. Add category styling in `src/style.css`
3. Update the `category` field in `src/writeups.js`

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- 🚀 No build process required
- 📦 Small bundle size (CDN resources cached)
- ⚡ Fast page loads
- 🎯 Optimized animations

## License

Free to use and modify for your own portfolio!

## Credits

Built with ❤️ by a cybersecurity enthusiast

---

**Happy Hacking! 🔐**

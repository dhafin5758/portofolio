# How to Add New Writeups

## Quick Steps

1. **Create your markdown file** in this folder (`writeups/`)
   - Example: `writeups/my-new-writeup.md`

2. **Add metadata at the top** of your markdown file:
   ```markdown
   # Your Writeup Title
   
   **Challenge:** Challenge Name
   **Category:** Web/Pwn/Crypto/Forensics
   **Difficulty:** Easy/Medium/Hard
   **Date:** December 23, 2025
   ```

3. **Update `src/writeups.js`**
   - Open `src/writeups.js`
   - Add a new entry to the `writeups` array:
   
   ```javascript
   {
       id: 'unique-id',                    // lowercase-with-dashes
       title: 'Display Title',             // What shows on the card
       description: 'Brief summary',       // Short description (1-2 lines)
       date: '2025-12-23',                // YYYY-MM-DD format
       category: 'web',                    // web, pwn, crypto, or forensics
       tags: ['Tag1', 'Tag2'],            // Array of tags
       file: 'writeups/filename.md'       // Path to your markdown file
   }
   ```

4. **Refresh your website** - Your writeup will now appear!

## Example Entry

```javascript
{
    id: 'buffer-overflow-challenge',
    title: 'Stack Buffer Overflow Exploitation',
    description: 'Exploiting a classic stack-based buffer overflow with ASLR bypass techniques.',
    date: '2025-12-20',
    category: 'pwn',
    tags: ['Binary Exploitation', 'Stack Overflow', 'ASLR'],
    file: 'writeups/buffer-overflow.md'
}
```

## Categories

- `web` - Web application security
- `pwn` - Binary exploitation
- `crypto` - Cryptography challenges
- `forensics` - Digital forensics and malware analysis

## Tips

- Keep descriptions concise (under 200 characters)
- Use descriptive tags that help users find related content
- Date format must be YYYY-MM-DD for proper sorting
- Each writeup ID must be unique

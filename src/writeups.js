// Write-ups configuration and data
const writeups = [
    {
        id: 'cacti',
        title: 'A Trail of Snow and Deception',
        description: 'analyzing network traffic.',
        date: '2025-12-23',
        category: 'forensics',
        tags: ['Forensics', 'NetworkAnalysis', 'Wireshark'],
        file: 'writeups/ATrailofSnowandDeception.md'
    },

    // To add a new writeup:
    // 1. Create a .md file in the writeups/ folder
    // 2. Add an entry here with:
    //    - id: unique identifier
    //    - title: Display title
    //    - description: Short summary
    //    - date: YYYY-MM-DD format
    //    - category: 'web', 'pwn', 'crypto', or 'forensics'
    //    - tags: Array of relevant tags
    //    - file: path to your .md file (writeups/filename.md)
];

// Helper function to get all unique categories
function getCategories() {
    const categories = new Set();
    writeups.forEach(w => categories.add(w.category));
    return Array.from(categories);
}

// Helper function to filter write-ups by category
function filterWriteups(category) {
    if (category === 'all') {
        return writeups;
    }
    return writeups.filter(w => w.category === category);
}

// Helper function to sort write-ups by date
function sortWriteupsByDate(writeupsArr, descending = true) {
    return writeupsArr.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return descending ? dateB - dateA : dateA - dateB;
    });
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { writeups, getCategories, filterWriteups, sortWriteupsByDate };
}

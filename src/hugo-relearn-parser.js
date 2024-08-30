function parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    const parsedContent = [];
    let currentSection = null;
    let inCodeBlock = false;

    lines.forEach((line, index) => {
        // Check for code block
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            if (currentSection) {
                currentSection.content.push(line);
            }
            return;
        }

        if (inCodeBlock) {
            if (currentSection) {
                currentSection.content.push(line);
            }
            return;
        }

        // Check for headers H1 to H5
        const headerMatch = line.match(/^(#{1,5})\s+(.+)/);
        if (headerMatch && !inCodeBlock) {
            const level = headerMatch[1].length;
            const title = headerMatch[2].trim();
            if (currentSection) {
                parsedContent.push(currentSection);
            }
            currentSection = { type: `h${level}`, title, content: [] };
            return;
        }

        // Add content to current section
        if (currentSection) {
            currentSection.content.push(line);
        } else {
            // If no current section, create a default one
            currentSection = { type: 'text', title: '', content: [line] };
        }
    });

    // Add the last section if it exists
    if (currentSection) {
        parsedContent.push(currentSection);
    }

    console.log('Parsed Content:', parsedContent);
    return parsedContent;
}

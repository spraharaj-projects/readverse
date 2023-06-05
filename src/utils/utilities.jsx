import { v5 as uuidv5 } from 'uuid';

export const addPlaceholder = (type, page, startPos, endPos) => {
    let newPage = page;
    switch (type) {
        case 'BOLD':
            newPage =
                page.slice(0, startPos) +
                '**' +
                page.slice(startPos, endPos) +
                '**' +
                page.slice(endPos);

            return newPage;
        case 'ITALIC':
            newPage =
                page.slice(0, startPos) +
                '*' +
                page.slice(startPos, endPos) +
                '*' +
                page.slice(endPos);

            return newPage;
        case 'STRIKETHROUGH':
            newPage =
                page.slice(0, startPos) +
                '~~' +
                page.slice(startPos, endPos) +
                '~~' +
                page.slice(endPos);

            return newPage;
        case 'UNDERLINE':
            newPage =
                page.slice(0, startPos) +
                '<u>' +
                page.slice(startPos, endPos) +
                '</u>' +
                page.slice(endPos);
            return newPage;
        case 'HR':
            newPage = page.slice(0, startPos) + '---' + page.slice(startPos);
            return newPage;
        case 'TITLE1':
            newPage = page.slice(0, startPos) + '#' + page.slice(startPos);
            return newPage;
        case 'TITLE2':
            newPage = page.slice(0, startPos) + '##' + page.slice(startPos);
            return newPage;
        case 'TITLE3':
            newPage = page.slice(0, startPos) + '###' + page.slice(startPos);
            return newPage;
        case 'TITLE4':
            newPage = page.slice(0, startPos) + '####' + page.slice(startPos);
            return newPage;
        case 'TITLE5':
            newPage = page.slice(0, startPos) + '#####' + page.slice(startPos);
            return newPage;
        case 'TITLE6':
            newPage = page.slice(0, startPos) + '######' + page.slice(startPos);
            return newPage;
        case 'LINK':
            newPage =
                page.slice(0, startPos) +
                '[' +
                page.slice(startPos, endPos) +
                ']()' +
                page.slice(endPos);
            return newPage;
        case 'QUOTE':
            let breakline =
                Math.max(
                    page.slice(0, startPos).lastIndexOf('\n'),
                    page.slice(0, startPos).lastIndexOf('\r')
                ) + 1;
            newPage = page.slice(0, breakline) + '> ' + page.slice(breakline);
            return newPage;
        case 'CODE':
            newPage =
                page.slice(0, startPos) +
                '`' +
                page.slice(startPos, endPos) +
                '`' +
                page.slice(endPos);
            return newPage;
        case 'CODEBLOCK':
            newPage =
                page.slice(0, startPos) +
                '\n~~~\n' +
                page.slice(startPos, endPos) +
                '\n~~~\n' +
                page.slice(endPos);
            return newPage;
        case 'CODEBLOCK-PY':
            newPage =
                page.slice(0, startPos) +
                '\n~~~python\n' +
                page.slice(startPos, endPos) +
                '\n~~~\n' +
                page.slice(endPos);
            return newPage;
        case 'CODEBLOCK-JAVA':
            newPage =
                page.slice(0, startPos) +
                '\n~~~java\n' +
                page.slice(startPos, endPos) +
                '\n~~~\n' +
                page.slice(endPos);
            return newPage;
        case 'CODEBLOCK-HTML':
            newPage =
                page.slice(0, startPos) +
                '\n~~~html\n' +
                page.slice(startPos, endPos) +
                '\n~~~\n' +
                page.slice(endPos);
            return newPage;
        case 'CODEBLOCK-CSS':
            newPage =
                page.slice(0, startPos) +
                '\n~~~css\n' +
                page.slice(startPos, endPos) +
                '\n~~~\n' +
                page.slice(endPos);
            return newPage;
        case 'CODEBLOCK-JS':
            newPage =
                page.slice(0, startPos) +
                '\n~~~js\n' +
                page.slice(startPos, endPos) +
                '\n~~~\n' +
                page.slice(endPos);
            return newPage;
        case 'COMMENT':
            newPage =
                page.slice(0, startPos) +
                '<!--' +
                page.slice(startPos, endPos) +
                '-->' +
                page.slice(endPos);
            return newPage;
        case 'IMAGE':
            newPage =
                page.slice(0, startPos) +
                '![' +
                page.slice(startPos, endPos) +
                ']()' +
                page.slice(endPos);
            return newPage;
        case 'UOLIST':
            newPage =
                page.slice(0, startPos) +
                '\n* Line 1\n* Line 2\n* Line 3\n' +
                page.slice(startPos);
            return newPage;
        case 'ORLIST':
            newPage =
                page.slice(0, startPos) +
                '\n1. Line 1\n2. Line 2\n3. Line 3\n' +
                page.slice(startPos);
            return newPage;
        case 'CHECKLIST':
            newPage =
                page.slice(0, startPos) +
                '\n- [ ] Line 1\n- [ ] Line 2\n- [x] Line 3\n' +
                page.slice(startPos);
            return newPage;
        default:
            return page;
    }
};

export const getAgoTime = (updatedOn) => {
    const minutes = Math.floor(
        (Math.floor(Date.now() / 1000) - updatedOn.seconds) / 60
    );
    if (minutes <= 1) return 'now';
    else {
        const hours = Math.floor(minutes / 60);
        if (hours < 1) {
            return `${minutes} mins ago`;
        } else {
            const days = Math.floor(hours / 24);
            if (days < 1) {
                return hours == 1 ? `${hours} hour ago` : `${hours} hours ago`;
            } else {
                const months = Math.floor(days / 30);
                if (months < 1) {
                    return days == 1 ? `${days} day ago` : `${days} days ago`;
                } else {
                    const years = Math.floor(months / 12);
                    if (years < 1) {
                        return months == 1
                            ? `${months} month ago`
                            : `${months} months ago`;
                    } else {
                        return years == 1
                            ? `${years} year ago`
                            : `${years} years ago`;
                    }
                }
            }
        }
    }
};

export const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export const getToc = (markdown) => {
    const lines = markdown.split('\n');
    const headers = [];
    let isInCodeBlock = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('```')) {
            isInCodeBlock = !isInCodeBlock;
        } else if (
            !isInCodeBlock &&
            line.match(/^#+\s+([^#\[\]]+)(?:\[.*\]\(.*\))?$/)
        ) {
            const text = line
                .match(/^#+\s+([^#\[\]]+)(?:\[.*\]\(.*\))?$/)[1]
                .trim();
            if (text !== '') {
                const level = line.match(/^#+/)[0].length;
                headers.push({ line: i + 1, text, level });
            }
        }
    }
    return headers.map((header) => {
        const id = uuidv5(`${header.text}-${header.line}`, NAMESPACE);
        return {
            id: 'head-' + id,
            line: header.line,
            text: header.text,
            level: header.level
        };
    });
};

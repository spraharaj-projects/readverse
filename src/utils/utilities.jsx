import { v5 as uuidv5 } from 'uuid';

const selectionEdit = (result, prefix, suffix) => {
    const page = result.page;
    const startPos = result.startPos;
    const endPos = result.endPos;
    const selection = page.slice(startPos, endPos);
    suffix = suffix ?? prefix;
    const n1 = prefix.length;
    const n2 = suffix.length;
    if (
        selection.length >= n1 + n2 &&
        selection.startsWith(prefix) &&
        selection.endsWith(suffix)
    ) {
        result.page =
            page.slice(0, startPos) +
            page.slice(startPos + n1, endPos - n2) +
            page.slice(endPos);
        result.endPos = endPos - (n1 + n2);
    } else {
        result.page =
            page.slice(0, startPos) +
            prefix +
            page.slice(startPos, endPos) +
            suffix +
            page.slice(endPos);
        if (startPos === endPos) {
            result.startPos = startPos + n1;
            result.endPos = endPos + n1;
        } else {
            result.endPos = endPos + (n1 + n2);
        }
    }
    return result;
};

const breaklineEdit = (result, prefix) => {
    const page = result.page;
    const startPos = result.startPos;
    const endPos = result.endPos;
    const breakline =
        Math.max(
            page.slice(0, startPos).lastIndexOf('\n'),
            page.slice(0, startPos).lastIndexOf('\r')
        ) + 1;
    const n = prefix.length;
    result.page = page.slice(0, breakline) + prefix + page.slice(breakline);
    result.startPos = startPos + n;
    result.endPos = endPos + n;
    return result;
};

export const addPlaceholder = (type, page, startPos, endPos) => {
    let result = {
        page,
        startPos,
        endPos
    };
    let breakline =
        Math.max(
            page.slice(0, startPos).lastIndexOf('\n'),
            page.slice(0, startPos).lastIndexOf('\r')
        ) + 1;
    switch (type) {
        case 'BOLD':
            result = selectionEdit(result, '**');
            break;
        case 'ITALIC':
            result = selectionEdit(result, '*');
            break;
        case 'STRIKETHROUGH':
            result = selectionEdit(result, '~~');
            break;
        case 'UNDERLINE':
            result = selectionEdit(result, '<u>', '</u>');
            break;
        case 'HR':
            result = breaklineEdit(result, '---\n');
            break;
        case 'TITLE1':
            result = breaklineEdit(result, '# ');
            break;
        case 'TITLE2':
            result = breaklineEdit(result, '## ');
            break;
        case 'TITLE3':
            result = breaklineEdit(result, '### ');
            break;
        case 'TITLE4':
            result = breaklineEdit(result, '#### ');
            break;
        case 'TITLE5':
            result = breaklineEdit(result, '##### ');
            break;
        case 'TITLE6':
            result = breaklineEdit(result, '###### ');
            break;
        case 'LINK':
            if (startPos === endPos) {
                result.page =
                    page.slice(0, startPos) +
                    '[enter text here](enter link here)' +
                    page.slice(endPos);
                result.startPos = startPos + 1;
                result.endPos = endPos + 16;
            } else {
                result.page =
                    page.slice(0, startPos) +
                    '[' +
                    page.slice(startPos, endPos) +
                    '](enter link here)' +
                    page.slice(endPos);
                result.startPos = endPos + 3;
                result.endPos = endPos + 18;
            }
            break;
        case 'QUOTE':
            result = breaklineEdit(result, '> ');
            break;
        case 'CODE':
            result = selectionEdit(result, '`');
            break;
        case 'CODEBLOCK':
            result = selectionEdit(result, '\n~~~\n');
            break;
        case 'CODEBLOCK-PY':
            result = selectionEdit(result, '\n~~~python\n', '\n~~~\n');
            break;
        case 'CODEBLOCK-JAVA':
            result = selectionEdit(result, '\n~~~java\n', '\n~~~\n');
            break;
        case 'CODEBLOCK-HTML':
            result = selectionEdit(result, '\n~~~html\n', '\n~~~\n');
            break;
        case 'CODEBLOCK-CSS':
            result = selectionEdit(result, '\n~~~css\n', '\n~~~\n');
            break;
        case 'CODEBLOCK-JS':
            result = selectionEdit(result, '\n~~~js\n', '\n~~~\n');
            break;
        case 'COMMENT':
            result = selectionEdit(result, '<!--', '-->');
            break;
        case 'IMAGE':
            if (startPos === endPos) {
                result.page =
                    page.slice(0, startPos) +
                    '![alt text](image url here)' +
                    page.slice(endPos);
                result.startPos = startPos + 2;
                result.endPos = endPos + 10;
            } else {
                result.page =
                    page.slice(0, startPos) +
                    '![' +
                    page.slice(startPos, endPos) +
                    '](enter link here)' +
                    page.slice(endPos);
                result.startPos = endPos + 4;
                result.endPos = endPos + 19;
            }
            break;
        case 'UOLIST':
            result.page =
                page.slice(0, startPos) +
                '\n* Line 1\n* Line 2\n* Line 3\n' +
                page.slice(startPos);
            result.startPos = startPos + 3;
            result.endPos = endPos + 9;
            break;
        case 'ORLIST':
            result.page =
                page.slice(0, startPos) +
                '\n1. Line 1\n2. Line 2\n3. Line 3\n' +
                page.slice(startPos);
            result.startPos = startPos + 4;
            result.endPos = endPos + 10;
            break;
        case 'CHECKLIST':
            result.page =
                page.slice(0, startPos) +
                '\n- [ ] Line 1\n- [ ] Line 2\n- [x] Line 3\n' +
                page.slice(startPos);
            result.startPos = startPos + 7;
            result.endPos = endPos + 13;
            break;
    }
    return result;
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

export const countWords = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
export const countChars = (text) => text.length;
export const countCharsNoSpace = (text) => text.replace(/\s/g, '').length;

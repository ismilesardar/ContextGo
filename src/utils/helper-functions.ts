export const removeWordFromPath = (path: string, word: string): string => {
  // Escape special regex characters in the word
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return path.replace(new RegExp(`/${escapedWord}(/|$)`, 'g'), '/');
};

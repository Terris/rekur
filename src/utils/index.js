export const stringToHash = (string) => {
  let hash = 0;
  let char = '';
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

export const createSlug = (text: string): string => {
  return (
    text
      // add space before capital letters (except first char)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // replace spaces with -
      .replace(/-+/g, '-')
  ); // remove duplicate -
};

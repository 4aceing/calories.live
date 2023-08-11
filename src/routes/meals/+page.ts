export const load = ({ url }) => {
  return {
    search: url.searchParams.get('search'),
  };
};

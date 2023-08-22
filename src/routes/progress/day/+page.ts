export const load = ({ url }) => {
  return {
    date: url.searchParams.get('date'),
  };
};

export const prerender = false;

export const load = ({ params }) => {
  return {
    id: params.id,
  };
};

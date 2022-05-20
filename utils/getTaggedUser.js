const getTaggedUser = msgObj => {
  const { id, first_name } = msgObj.from;

  return `[${first_name}](tg://user?id=${id})`;
};

export default getTaggedUser;

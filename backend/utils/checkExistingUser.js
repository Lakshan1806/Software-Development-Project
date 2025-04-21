const checkExistingUser = async (field, value, userModel) => {
  const query = {};
  query[field] = value;
  const existingUser = await userModel.findOne(query);
  return existingUser ? true : false;
};

export default checkExistingUser;

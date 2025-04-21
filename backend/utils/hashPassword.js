import bcrypt from "bcrypt";

 const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
export default hashPassword;

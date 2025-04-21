import jwt from "jsonwebtoken";

const generateJwtToken = (userId, username) => {
  return jwt.sign(
    { id: userId, username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export default generateJwtToken;

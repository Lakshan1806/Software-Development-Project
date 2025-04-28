import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ succes: false, message: "not Authorized" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id
      next();
    } else {
      return res.json({ succes: false, message: "not Authorized Login again" });
    }
    
  } catch (error) {
    return res.json({ succes: false, message: error.message });
  }
};

export default userAuth;

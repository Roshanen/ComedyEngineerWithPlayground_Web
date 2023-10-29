import jwt from "jsonwebtoken";

export default function checkKey(req, res, next) {
  const { key } = req.query;

  if (isValidKey(key)) {
    next();
  } else {
    res.redirect("/login");
  }
  
  function isValidKey(token, keyType) {
    try {
      const key = keyType === "access" ? "Ac-key" : "Rf-key";
      jwt.verify(token, key);
      return true;
    } catch (error) {
      return false;
    }
  }
}


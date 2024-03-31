import jwt from "jsonwebtoken";

export const userAuth = (request, response, next) => {
  try {
    const token = request.header("x-auth-token");
    jwt.verify(token,  process.env.SECRET_KEY);
    next();
  } catch {
    response.status(401).send({ message: "not allowed" });
  }
};
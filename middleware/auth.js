import CustomErrorHandler from "../service/CustomErrorHandler";
import JwtService from "../service/JwtService";

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized());
  }

  let token = authHeader.split(" ")[1];

  try {
    const { _id, role } = await JwtService.verify(token);
    const user = {
      _id,
      role,
    };
    req.user = user;
    next();
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized());
  }
};

export default auth;

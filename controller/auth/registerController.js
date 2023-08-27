//make a controller object and export it
import Joi from "joi";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import { RefreshToken, User } from "../../model";
import bcrypt from "bcrypt";
import JwtService from "../../service/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
  //register user Logic
  async register(req, res, next) {
    // []validate the request
    // []authorize the request
    // []check if user is in the database already
    // []prepare the model
    // []store in database
    // []generate jwt token
    // []send response

    //validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9{3,30}$]"))
        .required(),
      repeat_password: Joi.ref("password"),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if user is in the database
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExists("This email is already in taken")
        );
      }
    } catch (error) {
      return next(error);
    }

    //Hash Password ********
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //prepare the model*******
    const { name, email, password } = req.body;
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    let access_token;
    let refresh_token;
    try {
      const mainUser = new User(user);
      const result = await mainUser.save();

      //tokken******
      access_token = JwtService.sign({ _id: result._id, role: result.role });

      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );
      //database whitelist
      await RefreshToken.create({ token: refresh_token });
    } catch (error) {
      return next(error);
    }

    res.json({ access_token: access_token, refresh_token: refresh_token });
  },
};

export default registerController;

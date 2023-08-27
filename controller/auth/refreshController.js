import Joi from "joi"
import { RefreshToken, User } from "../../model"
import CustomErrorHandler from "../../service/CustomErrorHandler"
import JwtService from "../../service/JwtService"
import { REFRESH_SECRET } from "../../config"

const refreshController = {
    async refresh (req, res, next) {
        //validate the request****
        const refreshSchema = Joi.object({
            refresh_token : Joi.string().required()
        })

        const {error} = refreshSchema.validate(req.body)

        if (error) {
            return next(error)
        }

        //database 
        let refreshToken;
        try{
            refreshToken = await RefreshToken.findOne({token:req.body.refresh_token})
            
            if(!refreshToken) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
            }
            let userId;
            try {
                const{_id} = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
            } catch (error) {
                return next(CustomErrorHandler.unAuthorized('invalid refresh token'))
            }
            const user = await User.findOne({_id: userId})
            
            if(!user) {
                return next(CustomErrorHandler.unAuthorized('No user found'))
            }

            //token
             //token generate*****
             const asscess_token= JwtService.sign({
                _id: user._id,
                role:user.role
             })
            let refresh_token = JwtService.sign(
                { _id: user._id, role: user.role },
                "1y",
                REFRESH_SECRET
              );
              //database wishlist
              await RefreshToken.create({ token: refresh_token });
             res.status(201).json({asscess_token,refresh_token})

        }catch(error){
            return next(new Error('Something went wrong'+ error.message))
        }

    }
}

export default refreshController
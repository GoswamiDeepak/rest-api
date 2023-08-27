import multer from "multer";
import path from "path";
import CustomErrorHandler from "../service/CustomErrorHandler";
import fs from "fs";
import Joi from "joi";
import Product from "../model/product";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage: storage,
  limits: { fileSize: 100000 * 5 },
}).single("image");

const product = {
  async store(req, res, next) {
    //multipart form data
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      const filePath = req.file.path;
      console.log(filePath);
      console.log(req.file);

      //validation
      const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });

      const { error } = productSchema.validate(req.body);

      if (error) {
        //delete the upload file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        return next(error);
      }

      const { name, price, size } = req.body;

      let document;

      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (error) {
        return next(error);
      }

      res.status(201).json(document);
    });
  },
  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      let filePath;

      if (req.file) {
        filePath = req.file.path;
      }

      //validation
      const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });

      const { error } = productSchema.validate(req.body);

      if (error) {
        if (filePath) {
          //delete the upload file
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        return next(error);
      }

      const { name, price, size } = req.body;

      let document;

      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            // image: filePath,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json(document);
    });
  },
  async destroy(req, res, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Product not found"));
    }
    //Delete image
    // const imagePath = document.image;
    const imagePath = document._doc.image;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
    });
    res.json(document);
  },
  async index(req, res, next) {
    const document = await Product.find()
      .select("-updatedAt -__v")
      .sort({ _id: -1 });
    if (!document) {
      return next(CustomErrorHandler.serverError());
    }
    res.json(document);
  },
  async show(req, res, next) {
    const document = await Product.findById({ _id: req.params.id });
    if(!document) {
        return next(CustomErrorHandler.serverError());
    }
    res.json(document);
  },
};

export default product;

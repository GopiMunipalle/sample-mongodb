import { Request, Response } from "express";
import productModel from "../models/Products";
import { RequestWithUser } from "../middleware/customTypes";
import userModel from "../models/User";
import cartModel from "../models/Cart";

const products = async (req: Request, res: Response) => {
  try {
    const url = "https://fakestoreapi.com/products";
    const response = await fetch(url);
    const data = await response.json();

    for (let product of data) {
      const { title, price, description, category, image, rating } = product;

      let location;

      if (product.id <= 5) {
        location = {
          type: "Point",
          coordinates: [78.4355513, 17.4384436],
        };
      } else if (product.id > 5 && product.id <= 10) {
        location = {
          type: "Point",
          coordinates: [71.4355513, 14.4384436],
        };
      } else if (product.id > 10 && product.id <= 20) {
        location = {
          type: "Point",
          coordinates: [76.4355513, 16.4384436],
        };
      }

      const newProduct = new productModel({
        title,
        price,
        description,
        category,
        image,
        rating,
        location: location,
      });

      await newProduct.save();
    }

    res.status(200).send({ message: "products added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const addProduct = async (req: RequestWithUser, res: Response) => {
  try {
    const { productId, isAdded } = req.body;
    const userEmail = req.email;

    const user = await userModel.findOne({ email: userEmail }).populate("cart");

    const userId = user?._id;

    const cart = await cartModel.findOne({ userId: userId });

    if (!isAdded) {
      const prod = cart?.products.find((product) =>
        (product as any).equals(productId)
      );
      if (!prod) {
        return res.status(404).send({ error: "product not found" });
      }
      await cart?.updateOne({ $pull: { products: productId } });
      return res.status(200).send({ msg: "Product deleted successfully" });
    }

    if (!cart) {
      const newCart = await cartModel.create({
        userId,
        products: [productId],
      });
      await newCart.save();
      await user?.updateOne({ $push: { cart: newCart._id } });
      await user?.save();
      return res.status(200).send({ message: "product Added Successfully" });
    }

    const isproductExists = cart.products.find((product) =>
      (product as any).equals(productId)
    );
    if (isproductExists) {
      return res.status(400).send({ error: "Product Exists Already" });
    }
    await cart.updateOne({ $push: { products: productId } });
    await cart.save();
    return res
      .status(200)
      .send({ message: "Product Added to cart Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getCartList = async (req: RequestWithUser, res: Response) => {
  try {
    const { cartId } = req.params;
    const products = await cartModel
      .findOne({ _id: cartId })
      .populate("products");
    if (!products) {
      return res.status(404).send({ error: "cartlist not found" });
    }
    const product = products.products.map((each) => each);
    res.status(200).send({ product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getCategoty = async (req: Request, res: Response) => {
  try {
    const categories = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
        },
      },
    ]);
    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const pagination = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const search = (req.query.search as string) || "";

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .send({ error: "Invalid page or pageSize parameters" });
    }

    const totalCount = await productModel.countDocuments();
    console.log(totalCount);
    const totalPages = Math.ceil(totalCount / pageSize);
    console.log(totalPages);
    const result = await productModel
      .find({
        $or: [{ title: { $regex: search, $options: "i" } }],
      })
      .sort({ createdAt: "asc" })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      page,
      pageSize,
      totalPages,
      totalCount,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default {
  products,
  addProduct,
  getCartList,
  getAllProducts,
  getSingleProduct,
  getCategoty,
  pagination,
};
//https://api.escuelajs.co/api/v1/products

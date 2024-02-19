import userModel from "../models/User";
import moviesModel from "../models/Movies";
import wishlistModel from "../models/Wishlist";
import { Request, Response } from "express";
import { RequestWithUser } from "../middleware/customTypes";

const Movies = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://freetestapi.com/api/v1/movies");
    const data = await response.json();
    for (let movie of data) {
      const {
        title,
        year,
        genre,
        rating,
        director,
        actors,
        plot,
        poster,
        trailer,
        runtime,
        awards,
        country,
        language,
        boxOffice,
        production,
        website,
      } = movie;
      const movies = new moviesModel({
        title,
        year,
        genre,
        rating,
        director,
        actors,
        plot,
        poster,
        trailer,
        runtime,
        awards,
        country,
        language,
        boxOffice,
        production,
        website,
      });
      await movies.save();
    }
    res.status(200).send("Movies Added");
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const addWishlist = async (req: RequestWithUser, res: Response) => {
  try {
    const { title, description } = req.body;
    const userEmail = req.email;
    const user = await userModel
      .findOne({ email: userEmail })
      .populate("wishlist");
    if (!user) {
      return res.status(404).send({ error: "Invalid user" });
    }
    if (!title || !description) {
      return res.status(400).send({ error: "Invalid data" });
    }
    if (user.wishlist && user.wishlist.length !== 0) {
      for (let i = 0; i <= user.wishlist.length; i++) {
        if (user.wishlist[i] && user.wishlist[i].title === title) {
          return res.status(400).send({ error: "title already exists" });
        }
      }
    }
    const newWishlist = new wishlistModel({
      title,
      description,
      wishlist: [],
    });
    await newWishlist.save();
    await user.updateOne({ $push: { wishlist: newWishlist._id } });
    return res.status(200).send({ message: "wishlist added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const addMovie = async (req: RequestWithUser, res: Response) => {
  try {
    const userEmail = req.email;
    const { wishlistId, movieId } = req.body;

    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(400).send({ error: "Invalid User" });
    }
    const wishlist = await wishlistModel.findOne({ _id: wishlistId });
    if (!wishlist) {
      return res.status(404).send({ error: "Internal Server Error" });
    }
    const movie = await moviesModel.findById(movieId);
    if (!movie) return res.status(404).send({ error: "movie not found" });

    const movieExists = wishlist.movies.some((movie) =>
      (movie._id as any).equals(movieId)
    );
    if (movieExists) {
      return res.status(400).send({ error: "Movie Exists Already" });
    }
    await wishlist.updateOne({ $push: { movies: { _id: movieId } } });
    return res.status(200).send({ message: "Movie Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getMovies = async (req: RequestWithUser, res: Response) => {
  try {
    const { wishlistId } = req.params;
    const movies = await wishlistModel
      .findOne({ _id: wishlistId })
      .populate("movies");

    if (!movies) return res.status(404).send({ error: "wishlist not found" });

    const movie = movies.movies.map((each) => each);
    res.status(200).send({ movie });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getWishlists = async (req: RequestWithUser, res: Response) => {
  try {
    const userEmail = req.email;
    const wishlist = await userModel.findOne({ email: userEmail });
    res.status(200).send(wishlist);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteWishlist = async (req: RequestWithUser, res: Response) => {
  try {
    const { wishlistId } = req.params;
    const userEmail = req.email;
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "Invalid User" });
    }
    const deleteWishlist = await wishlistModel.findByIdAndDelete({
      _id: wishlistId,
    });
    if (!deleteWishlist) {
      return res.status(404).send({ error: "wishlist id not found" });
    }
    const removeWishlistFromUser = await userModel.updateMany(
      {},
      { $pull: { wishlist: wishlistId } }
    );
    return res.status(200).send({ message: "wishlist deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteMovie = async (req: RequestWithUser, res: Response) => {
  try {
    const { movieId } = req.params;
    const userEmail = req.email;
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "user not found" });
    }

    const deleteMovie = await moviesModel.findByIdAndDelete(movieId);
    if (!deleteMovie) {
      return res.status(404).send({ error: "movie not found" });
    }

    const deleteMovieIdFromWishlist = await wishlistModel.updateMany(
      {},
      { $pull: { movies: movieId } }
    );

    return res.status(200).send({ message: "movie deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server" });
  }
};

export default {
  Movies,
  addWishlist,
  addMovie,
  getMovies,
  getWishlists,
  deleteWishlist,
  deleteMovie,
};

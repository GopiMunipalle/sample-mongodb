"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Movies_1 = __importDefault(require("../models/Movies"));
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const Movies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://freetestapi.com/api/v1/movies");
        const data = yield response.json();
        for (let movie of data) {
            const { title, year, genre, rating, director, actors, plot, poster, trailer, runtime, awards, country, language, boxOffice, production, website, } = movie;
            const movies = new Movies_1.default({
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
            yield movies.save();
        }
        res.status(200).send("Movies Added");
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const addWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const userEmail = req.email;
        const user = yield User_1.default
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
        const newWishlist = new Wishlist_1.default({
            title,
            description,
            wishlist: [],
        });
        yield newWishlist.save();
        yield user.updateOne({ $push: { wishlist: newWishlist._id } });
        return res.status(200).send({ message: "wishlist added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.email;
        const { wishlistId, movieId } = req.body;
        const user = yield User_1.default.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).send({ error: "Invalid User" });
        }
        const wishlist = yield Wishlist_1.default.findOne({ _id: wishlistId });
        if (!wishlist) {
            return res.status(404).send({ error: "Internal Server Error" });
        }
        const movie = yield Movies_1.default.findById(movieId);
        if (!movie)
            return res.status(404).send({ error: "movie not found" });
        const movieExists = wishlist.movies.some((movie) => movie._id.equals(movieId));
        if (movieExists) {
            return res.status(400).send({ error: "Movie Exists Already" });
        }
        yield wishlist.updateOne({ $push: { movies: { _id: movieId } } });
        return res.status(200).send({ message: "Movie Added Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wishlistId } = req.params;
        const movies = yield Wishlist_1.default
            .findOne({ _id: wishlistId })
            .populate("movies");
        if (!movies)
            return res.status(404).send({ error: "wishlist not found" });
        const movie = movies.movies.map((each) => each);
        res.status(200).send({ movie });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const getWishlists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.email;
        const wishlist = yield User_1.default.findOne({ email: userEmail });
        res.status(200).send(wishlist);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const deleteWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wishlistId } = req.params;
        const userEmail = req.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send({ error: "Invalid User" });
        }
        const deleteWishlist = yield Wishlist_1.default.findByIdAndDelete({
            _id: wishlistId,
        });
        if (!deleteWishlist) {
            return res.status(404).send({ error: "wishlist id not found" });
        }
        const removeWishlistFromUser = yield User_1.default.updateMany({}, { $pull: { wishlist: wishlistId } });
        return res.status(200).send({ message: "wishlist deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const userEmail = req.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send({ error: "user not found" });
        }
        const deleteMovie = yield Movies_1.default.findByIdAndDelete(movieId);
        if (!deleteMovie) {
            return res.status(404).send({ error: "movie not found" });
        }
        const deleteMovieIdFromWishlist = yield Wishlist_1.default.updateMany({}, { $pull: { movies: movieId } });
        return res.status(200).send({ message: "movie deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server" });
    }
});
exports.default = {
    Movies,
    addWishlist,
    addMovie,
    getMovies,
    getWishlists,
    deleteWishlist,
    deleteMovie,
};

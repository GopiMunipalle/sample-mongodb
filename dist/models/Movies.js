"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moviesSchema = new mongoose_1.Schema({
    title: String,
    year: Number,
    genre: [],
    rating: Number,
    director: String,
    actors: [],
    plot: String,
    poster: String,
    trailer: String,
    runtime: Number,
    awards: String,
    country: String,
    language: String,
    boxOffice: String,
    production: String,
    website: String,
});
const moviesModel = (0, mongoose_1.model)("Movies", moviesSchema);
exports.default = moviesModel;

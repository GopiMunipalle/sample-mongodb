import { Schema, model } from "mongoose";

type movieType = {
  title: string;
  year: number;
  genre: [];
  rating: number;
  director: string;
  actors: [];
  plot: string;
  poster: string;
  trailer: string;
  runtime: number;
  awards: string;
  country: string;
  language: string;
  boxOffice: string;
  production: string;
  website: string;
};

const moviesSchema = new Schema<movieType>({
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

const moviesModel = model<movieType>("Movies", moviesSchema);
export default moviesModel;

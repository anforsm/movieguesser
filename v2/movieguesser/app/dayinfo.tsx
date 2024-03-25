import moment from "moment";
import movies from "./shuffled_titles"

const daysPassed = (date: Date) => {
  return -moment([2022, 0, 1]).diff(date, "days");
};

const getMovie = (movie_num: number = -1) => {
  let currentDay = movie_num === -1 ? daysPassed(new Date()) : movie_num;
  let movie: any = movies[(currentDay - 1) % movies.length];
  return movie
}

export default getMovie
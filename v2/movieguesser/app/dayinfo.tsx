import moment from "moment";
import movies from "./shuffled_titles"

const daysPassed = (date: Date) => {
  return -moment([2022, 0, 1]).diff(date, "days");
};

const getMovie = () => {
  let currentDay = daysPassed(new Date());
  let movie: any = movies[(currentDay - 1) % movies.length];
  return movie
}

export default getMovie
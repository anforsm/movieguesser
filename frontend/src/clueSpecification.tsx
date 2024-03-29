import {
  Actor,
  Director,
  Poster,
  Quote,
  Rating,
  Title,
  Writer,
  Budget,
  Year,
} from "./components/game/clue";

let clueSpecification: any = {};
const addClue = (
  clueName: string,
  component: any,
  pointCost: number[],
  id: number = -1,
  value: string = ""
) => {
  if (value === "") {
    if (id === -1) {
      value = clueName;
    } else {
      value = clueName + "s";
    }
  } else {
    value = value;
  }
  value = value === "" ? clueName : value;
  let clueId = id === -1 ? clueName : clueName + id.toString();
  clueSpecification[clueId] = {
    clue: clueName,
    clueID: clueId,
    clueNum: id,
    maxReveals: pointCost.length,
    pointCost: pointCost,
    Component: component,
    value: value,
  };
};

addClue("title", Title, [10, 20]);
addClue("poster", Poster, [20, 15], -1, "imdbID");
addClue("year", Year, [2]);
addClue("rating", Rating, [1]);
addClue("director", Director, [2]);
//addClue("writer", Writer, [8])
addClue("budget", Budget, [1]);
addClue("quote", Quote, [8]);
const actorGuesses = [5, 2];
addClue("actor", Actor, actorGuesses, 1);
addClue("actor", Actor, actorGuesses, 2);
addClue("actor", Actor, actorGuesses, 3);

let total = Object.values(clueSpecification).reduce(
  (prev, current: any) =>
    prev + current.pointCost.reduce((p: any, c: any) => p + c, 0),
  0
);
console.log(total);

export default clueSpecification;

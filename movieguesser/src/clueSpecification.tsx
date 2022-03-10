import { Actor, Director, Poster, Quote, Rating, Title, Writer, Year } from "./components/clue";

let clueSpecification: any = {};
const addClue = (clueName: string, component: any, pointCost: number[], id: number = -1) => {
  let clueId = id === -1 ? clueName : clueName + id.toString();
  clueSpecification[clueId] = {
    clue: clueName,
    clueID: clueId,
    clueNum: id,
    maxReveals: pointCost.length,
    pointCost: pointCost,
    Component: component,
  }
};

addClue("title", Title, [10, 10])
addClue("poster", Poster, [20])
addClue("year", Year, [4])
addClue("rating", Rating, [4])
addClue("director", Director, [10])
addClue("writer", Writer, [8])
addClue("quote", Quote, [8])
const actorGuesses = [6, 6]
addClue("actor", Actor, actorGuesses, 1)
addClue("actor", Actor, actorGuesses, 2)
addClue("actor", Actor, actorGuesses, 3)

export default clueSpecification;
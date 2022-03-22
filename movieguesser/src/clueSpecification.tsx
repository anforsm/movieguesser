import { Actor, Director, Poster, Quote, Rating, Title, Writer, Budget, Year } from "./components/clue";

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

addClue("title", Title, [10, 15])
addClue("poster", Poster, [10, 15])
addClue("year", Year, [2])
addClue("rating", Rating, [1])
addClue("director", Director, [3])
//addClue("writer", Writer, [8])
addClue("budget", Budget, [1])
addClue("quote", Quote, [10])
const actorGuesses = [8, 3]
addClue("actor", Actor, actorGuesses, 1)
addClue("actor", Actor, actorGuesses, 2)
addClue("actor", Actor, actorGuesses, 3)

let total = Object.values(clueSpecification).reduce((prev, current: any) => prev + current.pointCost.reduce((p: any, c: any) => p + c, 0), 0)
console.log(total)

export default clueSpecification;
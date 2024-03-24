import Image from "next/image";
//import { Game, Poster, Title } from "./box";
import Game from "./components/game";
import getMovie from "./dayinfo";


const movie = getMovie();

export default function Home() {
  console.log(movie)

  return (
    <main className="flex flex-col justify-center items-center h-full my-8 relative">
      <Game movie={movie}/>
    </main>
  );
}

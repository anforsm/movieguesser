import Image from "next/image";
//import { Game, Poster, Title } from "./box";
import Game from "./components/game";
import getMovie from "./dayinfo";


const movie = getMovie();

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-full md:my-8 my-2 relative">
      <Game movie={movie}/>
    </main>
  );
}

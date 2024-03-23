import Image from "next/image";
//import { Game, Poster, Title } from "./box";
import Game from "./components/game";

export default function Home() {

      //<Poster/>
      //<Title/>
  return (
    <main className="flex flex-col justify-center items-center h-full my-8 relative">
      <Game/>
    </main>
  );
}

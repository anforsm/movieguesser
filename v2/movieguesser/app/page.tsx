import Image from "next/image";
//import { Game, Poster, Title } from "./box";
import Game from "./components/game";

export default function Home() {

      //<Poster/>
      //<Title/>
  return (
    <main className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center">
      <Game/>
    </main>
  );
}

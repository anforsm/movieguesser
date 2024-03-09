import Image from "next/image";
import { Poster, Title } from "./box";

export default function Home() {
  return (
    <main className="min-h-screen py-24 bg-[#0f172a]">
      <Poster/>
      <Title/>
    </main>
  );
}

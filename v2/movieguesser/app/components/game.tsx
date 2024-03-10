"use client";
import { Canvas } from "@react-three/fiber";
import Poster from "./poster";
import Title from "./title"
import { Bounds, OrthographicCamera } from "@react-three/drei";
import { NoToneMapping } from "three";
import Info from "./info";
import Quote from "./quote";
import Actor from "./actor";

const interpolateFunc = (t: number) => 1 - Math.exp(-5 * t) + 0.007 * t // Matches the default Bounds behavior

const CARD_THICKNESS = 0.2;

      //<Title thickness={CARD_THICKNESS} position={[0, 0, 0]}/>
      //<Bounds fit clip observe margin={1.2} maxDuration={1} interpolateFunc={interpolateFunc}></Bounds>
const Game = (props: any) => {
  return <div className="h-screen w-screen">
    <Canvas gl={{toneMapping: NoToneMapping}}>
      <OrthographicCamera makeDefault position={[0, -3, 10]} zoom={70}/>
      <Poster thickness={CARD_THICKNESS} position={[-2, -2.5, 0]}/>
      <Title thickness={CARD_THICKNESS} position={[0, 0, 0]}/>
      <Info thickness={CARD_THICKNESS} position={[0, -1.625, 0]} name="Release Year" value="2001"/>
      <Info thickness={CARD_THICKNESS} position={[1.75, -1.625, 0]} name="Rating" value="8.9"/>

      <Info thickness={CARD_THICKNESS} position={[0, -3.25, 0]} name="Director" value="P. Jackson"/>
      <Info thickness={CARD_THICKNESS} position={[1.75, -3.25, 0]} name="Budget" value="$93M"/>

      <Quote thickness={CARD_THICKNESS} position={[0, -4.875, 0]}/>

      <Actor thickness={CARD_THICKNESS} position={[-2.2, -7.5, 0]} name="Elijah Wood" role="Frodo Baggins" image="elijah.webp"/>
      <Actor thickness={CARD_THICKNESS} position={[0, -7.5, 0]} name="Ian McKellen" role="Gandalf" image="ian.webp"/>
      <Actor thickness={CARD_THICKNESS} position={[2.2, -7.5, 0]} name="Viggo Mortensen" role="Aragorn" image="viggo.webp"/>

    </Canvas>
  </div>
}

export default Game;

"use client";
import { Canvas } from "@react-three/fiber";
import Poster from "./poster";
import Title from "./title"
import { Bounds, OrthographicCamera } from "@react-three/drei";
import { NoToneMapping } from "three";
import Info from "./info";
import Quote from "./quote";
import Actor from "./actor";
import { cloneElement } from "react";
import GuessBox from "./guessbox";
import Score from "./score";

const costs = [
  10,
  20,
  5,
  5,
  5,
  5,
  10,
  10,
  10,
  10,
]


const CARD_THICKNESS = 0.2;
const layout = `
000000000000
000000000000
000000000000
111122223333
111122223333
111122223333
111144445555
111144445555
111144445555
666666666666
666666666666
666666666666
777788889999
777788889999
777788889999
777788889999
777788889999
777788889999`.trim()

let rows = layout.split("\n")
const num_rows = rows.length
const num_cols = rows[0].length


const getTileSizeAndPosition = (tile_index: number, layout: string) => {
  let rows = layout.split("\n")
  const num_rows = rows.length
  const num_cols = rows[0].length

  let xs = num_cols
  let xe = 0 
  let ys = num_rows
  let ye = 0

  rows.forEach((row, row_i) => {
    let row_list = row.split("");
    row_list.forEach((col, col_i) => {
      if (Number(col) !== tile_index)
        return;

      if (col_i < xs)
        xs = col_i

      if (col_i > xe)
        xe = col_i
      
      if (row_i < ys)
        ys = row_i

      if (row_i > ye)
        ye = row_i
    })
  })
  xe += 1
  ye += 1

  return [[xe-xs, ye-ys], [((xe-xs)/2 + xs)/2, -((ye-ys)/2 + ys)/2]]
}

const CoreGame = (props: any) => {


  const createTiles = (layout: any) => {
    return [
      <Title thickness={CARD_THICKNESS}/>,
      <Poster thickness={CARD_THICKNESS}/>,
      <Info thickness={CARD_THICKNESS} name="Release Year" value="2001"/>,
      <Info thickness={CARD_THICKNESS} name="Rating" value="8.9"/>,
      <Info thickness={CARD_THICKNESS} name="Director" value="P. Jackson"/>,
      <Info thickness={CARD_THICKNESS} name="Budget" value="$93M"/>,
      <Quote thickness={CARD_THICKNESS}/>,
      <Actor thickness={CARD_THICKNESS} name="Elijah Wood" role="Frodo Baggins" image="elijah.webp"/>,
      <Actor thickness={CARD_THICKNESS} name="Ian McKellen" role="Gandalf" image="ian.webp"/>,
      <Actor thickness={CARD_THICKNESS} name="Viggo Mortensen" role="Aragorn" image="viggo.webp"/>
    ].map((tile, i) => {
      let [size, pos] = getTileSizeAndPosition(i, layout)
      return cloneElement(tile, {
        ...tile.props,
        position: pos,
        size: size,
        key: i,
        onFlip: () => props.onReveal(costs[i])
      })
    })
  }
  return <div className="h-full max-w-[90vw] aspect-[2/3]">
    <Canvas gl={{toneMapping: NoToneMapping}}>
      <Bounds fit clip observe maxDuration={0} margin={1}>
        <OrthographicCamera makeDefault position={[num_cols/4, -num_rows/4, 10]}/>
        {createTiles(layout)}
      </Bounds>
    </Canvas>
  </div>
}

export default CoreGame;
import Clue from "./clue"

const ClueGrid = (props: any) => {
  return (
    <div id="clueTable" className="clueTable p-[2%] w-full grow">
      {Object.values(props.clueSpecification).map((clue: any, index: number) => (
        <div key={clue.clueID} className={clue.clueID}>
          <Clue
            {...clue}
            reveals={props.showAll ? clue.maxReveals : props.reveals[clue.clueID]}
            onReveal={() => props.onReveal(clue.clueID, clue.pointCost[props.reveals[clue.clueID]])}
            value={clue.clueNum === -1 ? props.movie[clue.value] : props.movie[clue.value][clue.clueNum - 1]}
            initialFlipDelay={100 * (index + 1)}
            gameOver={props.showAll}
          />
        </div>
      ))}
    </div>
  )
}

export default ClueGrid
import clueSpecification from "../clueSpecification"
import Clue from "./clue"

const ClueGrid = (props: any) => {
  return (
    <div id="clueTable" className="p-4">
      {Object.values(clueSpecification).map((clue: any) => (
        <div key={clue.clueID} className={clue.clue}>
          <Clue
            {...clue}
            reveals={props.showAll ? clue.maxReveals : props.reveals[clue.clueID]}
            onReveal={() => props.onReveal(clue.clueID, clue.pointCost[props.reveals[clue.clueID]])}
            value={clue.clueNum === -1 ? props.movie[clue.clue] : props.movie[clue.clue + "s"][clue.clueNum - 1]}
          />
        </div>
      ))}
    </div>
  )
}

export default ClueGrid
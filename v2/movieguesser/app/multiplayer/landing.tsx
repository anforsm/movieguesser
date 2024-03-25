import { propagateServerField } from "next/dist/server/lib/render-server"
import { useState } from "react"



const vocab = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const getRoomCode = () => {
  let roomCode = ""
  for (let i = 0; i < 6; i++) {
    roomCode += vocab[Math.floor(Math.random() * vocab.length)]
  }
  return roomCode
}

const Landing = (props: any) => {
  const [showJoin, setShowJoin] = useState(false)
  const [roomCode, setRoomCode] = useState("");

  return <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <button 
        className="bg-primary-600 p-2 rounded-md w-56"
        onClick={() => {
          const roomCode = getRoomCode()
          props.onJoin(roomCode)
          console.log(roomCode)
        }}
      >
        Create new game
      </button>
      {!showJoin ? <button 
        className="bg-primary-600 p-2 rounded-md w-56"
        onClick={() => setShowJoin(true)}
      >
        Join game
      </button> : <div className="flex w-56">
      <input 
        className="bg-primary-600 p-2 rounded-md grow"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button 
        className="bg-primary-600 p-2 rounded-md w-8"
        onClick={() => {
          props.onJoin(roomCode)
        }}
      >&gt;
      </button>
      </div>}
  </div>
}

export default Landing
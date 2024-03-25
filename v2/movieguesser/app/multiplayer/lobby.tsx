import { useEffect, useState } from "react"
import { database } from "../firebaseConfig"
import { ref, get, child, push, update} from "firebase/database"
import { useObject } from "react-firebase-hooks/database"
import MultiplayerGame from "./multiplayerGame"

const PLAYERS_PER_GAME = 2

const generatePlayerName = () => {
  return "Player " + Math.floor(Math.random() * 1000)
}

const createRoom = (roomCode: string, player: string) => {
  return {
    "players": [player],
    "roomCode": roomCode,
    "movieNumber": Math.floor(Math.random() * 1000),
  }
}

const Lobby = (props: any) => {
  const [player, setPlayer] = useState(generatePlayerName())
  const [snapshot, loading, error] = useObject(ref(database, 'rooms/' + props.roomCode))
  const [room, setRoom] = useState({})

  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (snapshot) {
      setRoom(snapshot.val())
    }
  }, [snapshot])

  useEffect(() => {
    // @ts-ignore
    if (room.players) {
      // @ts-ignore
      setPlayers(room.players)
    }
  }, [room])

  useEffect(() => {
    (async () => {
      // push roomCode to database if not already exist
      let rooms = ref(database);
      let path = `rooms/${props.roomCode}`
      let snapshot = await get(child(rooms, path))
      if (!snapshot.exists()) {
        let room_ = createRoom(props.roomCode, player)
        let updates: any = {}
        updates[path] = room_
        update(ref(database), updates)
      }
      
      let room_ = (await get(child(rooms, path))).val()
      let players_ = room_.players
      if (!players_.includes(player)) {
        players_.push(player)
        let updates: any = {}
        updates[path + "/players"] = players_
        update(ref(database), updates)
      }
    })()
  }, []);

  const [timer, setTimer] = useState(5)
  useEffect(() => {
    console.log(room)
    if (players.length == PLAYERS_PER_GAME && timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1)
      }, 1000)
    }
  }, [timer, players])

  if (loading) {
    return <div>Loading...</div>
  }

  return <div className="flex flex-col w-full h-full items-center">
    <span>
      Room: {props.roomCode} | Players online: {players.length}
    </span>
    {players.length !== PLAYERS_PER_GAME && <span>Waiting for players...</span>}
    {players.length === PLAYERS_PER_GAME && timer !== 0 && <span>Starting game in {timer}</span>}
    {timer === 0 && <MultiplayerGame room={room}/>}
  </div>
}

export default Lobby 
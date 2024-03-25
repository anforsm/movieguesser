"use client";
import { getDatabase, ref, onValue } from "firebase/database";
import { useObject } from 'react-firebase-hooks/database';
import Image from "next/image";
import app, { database } from "../firebaseConfig";
import Landing from "./landing";
import { useState } from "react";
import Lobby from "./lobby";


export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [snapshot, loading, error] = useObject(ref(database, 'test'));

  return (
    <main className="flex flex-col justify-center items-center h-full md:my-8 my-2 relative gap-2 w-full">
      {roomCode === '' && <Landing onJoin={(code: string) => setRoomCode(code)}/>}
      {roomCode !== '' && <Lobby roomCode={roomCode}/>}
      {/* {snapshot && <span>Value: {snapshot.val()}</span>} */}
    </main>
  );
}
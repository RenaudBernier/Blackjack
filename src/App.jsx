import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {shoe} from "./Shoe.jsx";
import PlayerHand from "./PlayerHand.jsx";



function App() {
  const [count, setCount] = useState(0);

  return (
      <main>
        <PlayerHand></PlayerHand>
      </main>
  )
}

export default App

import { useEffect, useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import useLocalStorage from "../hooks/useLocalStorage";
import loadSettings from "../utils/loadSettings";
import Dropdown from "./dropdown";
import Toggle from "./toggle";
import IMDBLogo from "../images/imdb_logo.svg";
import TMDBLogo from "../images/tmdb_logo.svg";
const toggles = [{
  label: "Show unblurred poster after game over",
  short: "posterblur"
},
//{
//  label: "Show statistics after game over",
//  short: "stats"
//},
//{
//  label: "Show link to IMDb after game over",
//  short: "imdb"
//},
{
  label: "Show button to enlarge poster",
  short: "posterzoom"
}
]

let defaultToggleStates: Record<string, boolean> = {}
toggles.forEach(({ short }: { short: string, label: string }) => defaultToggleStates[short] = false);


const Settings = (props: any) => {
  //const [settings, setSettings] = useLocalStorage("settings", {
  //  theme: "movieguesser",
  //  background: "",
  //  toggleStates: defaultToggleStates
  //});
  const [settings, setSettings] = useState(props.settingsHandler.getSettings())

  useEffect(() => {
    let obs = () => {
      setSettings({ ...props.settingsHandler.getSettings() })
    }
    props.settingsHandler.addObserver(obs);
    return () => props.settingsHandler.removeObserver(obs);
  }, [])



  useEffect(() => {
    //loadSettings(settings)
    //console.log(settings)
    //if (settings.background)
    //  props.onSetBackground(props.movieInfo.backdrop);
  }, [settings])

  return <>
    <div className="text-2xl">Settings</div>
    <div className="flex flex-col gap-4">
      <div>&nbsp;</div>
      <div>
        <span>Color theme: </span>
        <Dropdown
          options={["Movieguesser", "Dark", "Light"]}

          default={props.settingsHandler.getTheme()}

          onSelect={(option: string) => props.settingsHandler.setTheme(option)}
        />
      </div>

      <div className="bg-primary-700 rounded-md overflow-hidden flex self-start">
        <button onClick={() => {
          if (props.gameOver) {
            props.settingsHandler.setBackground(props.movieInfo.backdrop)
          } else {
            props.notificationHandler.sendNotification("Finish the game first!")
          }
        }} className="px-2 py-1">Set background to today's movie</button>
        <div className=" bg-text-col w-[1px] inline-block" />
        <button className="w-12 py-1" onClick={() => {
          props.settingsHandler.setBackground("");
        }}>Clear</button>
      </div>

      <div className="w-full h-0">&nbsp;</div>
      <ToggleGroup toggleStates={settings.toggleStates} toggles={toggles} onToggle={(shortName: string, val: boolean) => {
        props.settingsHandler.setToggleState(shortName, val)
      }} />

      <div className="w-full h-1">&nbsp;</div>

      <div className="w-full text-sm flex justify-center">
        <div className=" w-1/3 mx-2 flex-center flex-col">
          <span>Images from</span>
          <div className="w-3/5"><a href="https://www.themoviedb.org/" target="_blank" rel="noopener"><img src={TMDBLogo} /></a></div>
        </div>
        <div className="w-1/3 mx-2 flex-center flex-col">
          <span>Today's movie on</span>
          <div className="w-3/5"><a href={`https://www.imdb.com/title/${props.movieInfo.imdbID}`} target="_blank" rel="noopener"><img src={IMDBLogo} /></a></div>
        </div>
      </div>

      <div className="w-full h-1">&nbsp;</div>

      <div className="w-full text-xs flex-center flex-col text-text-col-secondary">
        <span>Version {localStorage.getItem("version")}</span>
        <span>Inspired by <a href="https://www.powerlanguage.co.uk/">Josh Wardle</a>'s <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>.</span>
        <span>Send feedback to <a href="mailto:feedback@movieguesser.com">feedback@movieugesser.com</a></span>
      </div>
    </div>
  </>
}

const ToggleGroup = (props: any) => {
  return <>{props.toggles.map((toggle: any) => <div key={toggle.short} className="flex w-full pb-2 pt-1 border-b border-b-text-col">
    <span className="grow mr-4">{toggle.label}</span>
    <Toggle onToggle={(val: boolean) => props.onToggle(toggle.short, val)} toggle={props.toggleStates[toggle.short]} />
  </div>)}
  </>
}

export default Settings;
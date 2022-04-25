import { FormControl, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import useLocalStorage from "../hooks/useLocalStorage";
import loadSettings from "../utils/loadSettings";
import Dropdown from "./dropdown";
import Toggle from "./toggle";
const toggles = [{
  label: "Show unblurred poster after game over",
  short: "posterblur"
},
{
  label: "Show statistics after game over",
  short: "stats"
},
{
  label: "Show link to IMDb after game over",
  short: "imdb"
},
{
  label: "Show button to enlarge poster",
  short: "posterzoom"
}
]

let defaultToggleStates: Record<string, boolean> = {}
toggles.forEach(({ short }: { short: string, label: string }) => defaultToggleStates[short] = false);


let set = localStorage.getItem("settings");
if (set) {
  let set2 = JSON.parse(set);
  if (!set2?.toggleStates) {
    localStorage.setItem("settings", JSON.stringify({
      ...set2,
      toggleStates: defaultToggleStates
    }));
  }
}

const Settings = (props: any) => {
  const [settings, setSettings] = useLocalStorage("settings", {
    theme: "movieguesser",
    background: "",
    toggleStates: defaultToggleStates
  });



  useEffect(() => {
    loadSettings(settings)
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
          default={settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
          onSelect={(option: string) => setSettings({
            ...settings,
            theme: option.toLowerCase(),
          })}
        />
      </div>

      <div className="bg-primary-700 rounded-md overflow-hidden flex self-start">
        <button onClick={() => {
          if (props.gameOver) {
            setSettings({
              ...settings,
              background: props.movieInfo.backdrop,
            })
            props.onSetBackground(props.movieInfo.backdrop)
          } else {
            props.notificationHandler.sendNotification("Finish the game first!")
          }
        }} className="px-2 py-1">Set background to today's movie</button>
        <div className=" bg-text-col w-[1px] inline-block" />
        <button className="w-12 py-1" onClick={() => {
          setSettings({
            ...settings,
            background: "",
          })
          props.onSetBackground("")
        }}>Clear</button>
      </div>

      <div>&nbsp;</div>
      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch name="test" />
            }
            labelPlacement="start"
            label="Test"
          />
        </FormGroup>
      </FormControl>


      <ToggleGroup toggleStates={settings.toggleStates} toggles={toggles} onToggle={(shortName: string, val: boolean) => {
        let prevToggleStates = { ...settings.toggleStates };
        prevToggleStates[shortName] = val
        setSettings({
          ...settings,
          toggleStates: prevToggleStates
        })
      }} />
      <div>&nbsp;</div>

      <div className="w-full text-sm flex justify-center">
        <span className="mx-2">Images from <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDB</a></span>
        <span className="mx-2">Today's movie on <a href={`https://www.imdb.com/title/${props.movieInfo.imdbID}`} target="_blank" rel="noopener">IMDb</a></span>
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
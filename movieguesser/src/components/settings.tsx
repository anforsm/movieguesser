import { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import loadSettings from "../utils/loadSettings";

const Settings = (props: any) => {
  const [settings, setSettings] = useLocalStorage("settings", {
    theme: "movieguesser",
  })

  useEffect(() => {
    loadSettings(settings)
  }, [settings])

  return <>
    <div className="text-xl">Settings</div>
    <div>
      <span>Color theme: </span>
      <select className=" bg-primary-600" onChange={(e) => {
        setSettings({
          ...settings,
          theme: e.target.value.toLowerCase(),
        })
      }}>
        <option selected={settings.theme === "movieguesser"} className="hover:bg-primary-700">Movieguesser</option>
        <option selected={settings.theme === "dark"} className="hover:bg-primary-700">Dark</option>
        <option selected={settings.theme === "light"} className="hover:bg-primary-700">Light</option>
      </select>
    </div>
  </>
}

export default Settings;
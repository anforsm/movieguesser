import { useEffect, useState } from "react";
import Dropdown from "components/inputs/dropdown";
import Toggle from "components/inputs/toggle";
import IMDBLogo from "images/imdb_logo.svg";
import TMDBLogo from "images/tmdb_logo.svg";
const toggles = [
  {
    label: "Show unblurred poster after game over",
    short: "posterblur",
  },
  {
    label: "Show button to enlarge poster",
    short: "posterzoom",
  },
];

let defaultToggleStates: Record<string, boolean> = {};
toggles.forEach(
  ({ short }: { short: string; label: string }) =>
    (defaultToggleStates[short] = false)
);

const Settings = (props: any) => {
  const [settings, setSettings] = useState(props.settingsHandler.getSettings());

  useEffect(() => {
    let obs = () => {
      setSettings({ ...props.settingsHandler.getSettings() });
    };
    props.settingsHandler.addObserver(obs);
    return () => props.settingsHandler.removeObserver(obs);
  }, []);

  useEffect(() => {}, [settings]);

  return (
    <>
      <div className="text-2xl">Settings</div>
      <div className="flex flex-col gap-4">
        <div>&nbsp;</div>
        <div>
          <span>Color theme: </span>
          <Dropdown
            options={["Movieguesser", "Dark", "Light"]}
            default={props.settingsHandler.getTheme()}
            onSelect={(option: string) =>
              props.settingsHandler.setTheme(option)
            }
          />
        </div>

        <div className="flex self-start overflow-hidden rounded-md bg-primary-700">
          <button
            onClick={() => {
              if (props.gameOver) {
                props.settingsHandler.setBackground(props.movieInfo.backdrop);
              } else {
                props.notificationHandler.sendNotification(
                  "Finish the game first!"
                );
              }
            }}
            className="px-2 py-1"
          >
            Set background to today's movie
          </button>
          <div className=" inline-block w-[1px] bg-text-col" />
          <button
            className="w-12 py-1"
            onClick={() => {
              props.settingsHandler.setBackground("");
            }}
          >
            Clear
          </button>
        </div>

        <div className="h-0 w-full">&nbsp;</div>
        <ToggleGroup
          toggleStates={settings.toggleStates}
          toggles={toggles}
          onToggle={(shortName: string, val: boolean) => {
            props.settingsHandler.setToggleState(shortName, val);
          }}
        />

        <div className="h-1 w-full">&nbsp;</div>

        <div className="flex w-full justify-center text-sm">
          <div className=" flex-center mx-2 w-1/3 flex-col">
            <span>Images from</span>
            <div className="w-3/5">
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener"
              >
                <img src={TMDBLogo} />
              </a>
            </div>
          </div>
          <div className="flex-center mx-2 w-1/3 flex-col">
            <span>Today's movie on</span>
            <div className="w-3/5">
              <a
                href={`https://www.imdb.com/title/${props.movieInfo.imdbID}`}
                target="_blank"
                rel="noopener"
              >
                <img src={IMDBLogo} />
              </a>
            </div>
          </div>
        </div>

        <div className="h-1 w-full">&nbsp;</div>

        <div className="flex-center w-full flex-col gap-1 text-xs text-text-col-secondary">
          <span>
            See more of my work at{" "}
            <a href="https://anforsm.com" target="_blank">
              anforsm.com
            </a>
          </span>
          <span>
            Send feedback to{" "}
            <a href="mailto:feedback@movieguesser.com" target="_blank">
              feedback@movieugesser.com
            </a>
          </span>
          <span>
            Inspired by{" "}
            <a href="https://www.powerlanguage.co.uk/" target="_blank">
              Josh Wardle
            </a>
            's{" "}
            <a
              href="https://www.nytimes.com/games/wordle/index.html"
              target="_blank"
            >
              Wordle
            </a>
            .
          </span>
          <span>Version {localStorage.getItem("version")}</span>
        </div>
      </div>
    </>
  );
};

const ToggleGroup = (props: any) => {
  return (
    <>
      {props.toggles.map((toggle: any) => (
        <div
          key={toggle.short}
          className="flex w-full border-b border-b-text-col pb-2 pt-1"
        >
          <span className="mr-4 grow">{toggle.label}</span>
          <Toggle
            onToggle={(val: boolean) => props.onToggle(toggle.short, val)}
            toggle={props.toggleStates[toggle.short]}
          />
        </div>
      ))}
    </>
  );
};

export default Settings;

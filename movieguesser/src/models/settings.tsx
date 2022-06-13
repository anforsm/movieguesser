class SettingsHandler {
  observers: any[]
  settings: any
  constructor() {
    this.settings = this.readSettingsFromLocal();
    this.writeSettingsToLocal();
    this.observers = [];
    this.updateThemeColor();
  }

  setTheme(theme: string) {
    this.setSettings({
      ...this.settings,
      theme: theme.toLowerCase()
    })
    this.updateThemeColor()
  }

  updateThemeColor() {
    switch (this.settings.theme) {
      case "dark":
        document.documentElement.classList.add("dark")
        document.documentElement.classList.remove("light")
        document.documentElement.classList.remove("og")
        break;
      case "light":
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("og")
        break;
      case "movieguesser":
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("og")
        break;
    }


  }

  getTheme() {
    return this.settings.theme.charAt(0).toUpperCase() +
      this.settings.theme.slice(1)
  }

  setBackground(background: string) {
    this.setSettings({
      ...this.settings,
      background: background
    })
  }

  getBackground() {
    return this.settings.background;
  }

  setToggleState(stateName: string, state: any) {
    let prevToggleStates = { ...this.settings.toggleStates };
    prevToggleStates[stateName] = state
    this.setSettings({
      ...this.settings,
      toggleStates: prevToggleStates
    })
  }

  getToggleStates() {
    return this.settings.toggleStates
  }

  getSettings() {
    return this.settings
  }

  setSettings(settings: any) {
    if (JSON.stringify(settings) !== JSON.stringify(this.settings)) {
      this.settings = settings;
      this.writeSettingsToLocal();
      this.notifyObservers();
    }
  }

  readSettingsFromLocal() {
    let settingsString = localStorage.getItem("settings");
    console.log(settingsString)
    if (!settingsString)
      return this.getDefaultSettings();

    let settings;
    try {
      settings = JSON.parse(settingsString);
    } catch (e) {
      return this.getDefaultSettings();
    }
    let new_settings = this.getDefaultSettings();
    this.recursivelyReadSettings(settings, new_settings);
    return new_settings;
  }

  recursivelyReadSettings(local_settings: any, new_settings: any) {
    Object.keys(local_settings).forEach((key: any) => {
      if (!(key in new_settings))
        return;

      if (typeof local_settings[key] === "object") {
        this.recursivelyReadSettings(local_settings[key], new_settings[key]);
      } else {
        new_settings[key] = local_settings[key];
      }
    })
  }

  writeSettingsToLocal() {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  setDefaultSettings() {
    this.settings = this.getDefaultSettings();
    this.notifyObservers();
  }

  getDefaultSettings() {
    return {
      "theme": "movieguesser",
      "background": "",
      "toggleStates": {
        "posterblur": false,
        "posterzoom": false,
      }
    }
  }

  addObserver(observer: any) {
    this.observers = [...this.observers, observer];
  }

  removeObserver(observer: any) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(arg: any = undefined) {
    this.observers.forEach(observer => {
      try {
        if (arg)
          observer(arg)
        if (!arg)
          observer()
      } catch (e) { }
    });
  }

}


export default SettingsHandler
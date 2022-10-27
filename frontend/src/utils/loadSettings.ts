const loadSettings = (settings: any) => {
  switch (settings.theme) {
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

export default loadSettings;
export interface IconDefinition {
  name: string;
  alias?: string[];
  viewBox: string;
  paths: string[];
}

export const Icons: {[n: string]: IconDefinition} = {
  open: {
    name: "open",
    viewBox: "0 0 20 20",
    paths: [
      "M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"
    ]
  },
  lyvely: {
    name: "lyvely",
    viewBox: "0 0 24 24",
    paths: [
      "M18.984 9.984h2.016v4.031h-2.016v-4.031zM15 18v-12h2.016v12h-2.016zM3 14.016v-4.031h2.016v4.031h-2.016zM11.016 21.984v-19.969h1.969v19.969h-1.969zM6.984 18v-12h2.016v12h-2.016z"
    ]
  },
  drag: {
    name: "drag",
    viewBox: "0 0 24 24",
    paths: [
      "M15 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM15 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM15 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609zM9 3.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM9 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM11.016 18q0 0.797-0.609 1.406t-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406z"
    ]
  },
  dropdown: {
    name: "dropdown",
    viewBox: "0 0 24 24",
    paths: [
      "M10.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.985 2.199-2.2s-0.984-2.2-2.199-2.2zM3.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.986 2.199-2.2s-0.984-2.2-2.199-2.2zM17.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.985 2.199-2.2s-0.984-2.2-2.199-2.2z"
    ]
  },
  activity: {
    name: "activity",
    viewBox: "0 0 24 24",
    paths: [
      "M22 11h-4c-0.439 0-0.812 0.283-0.949 0.684l-2.051 6.154-5.051-15.154c-0.175-0.524-0.741-0.807-1.265-0.633-0.31 0.103-0.535 0.343-0.633 0.633l-2.772 8.316h-3.279c-0.552 0-1 0.448-1 1s0.448 1 1 1h4c0.423-0.003 0.81-0.267 0.949-0.684l2.051-6.154 5.051 15.154c0.098 0.29 0.323 0.529 0.632 0.632 0.524 0.175 1.090-0.109 1.265-0.632l2.773-8.316h3.279c0.552 0 1-0.448 1-1s-0.448-1-1-1z"
    ]
  },
  journal: {
    name: "journal",
    viewBox: "0 0 24 24",
    paths: [
      "M17.484 14.344q1.219 0 2.531 0.234v1.5q-0.938-0.234-2.531-0.234-2.813 0-4.5 0.984v-1.688q1.781-0.797 4.5-0.797zM12.984 12.469q1.969-0.797 4.5-0.797 1.219 0 2.531 0.234v1.5q-0.938-0.234-2.531-0.234-2.813 0-4.5 0.984v-1.688zM17.484 10.5q-2.813 0-4.5 0.984v-1.641q1.875-0.844 4.5-0.844 1.219 0 2.531 0.234v1.547q-1.125-0.281-2.531-0.281zM21 18.516v-11.531q-1.547-0.469-3.516-0.469-3.047 0-5.484 1.5v11.484q2.438-1.5 5.484-1.5 1.828 0 3.516 0.516zM17.484 4.5q3.563 0 5.531 1.5v14.578q0 0.188-0.164 0.352t-0.352 0.164q-0.141 0-0.234-0.047-1.922-1.031-4.781-1.031-3.047 0-5.484 1.5-2.016-1.5-5.484-1.5-2.531 0-4.781 1.078-0.047 0-0.117 0.023t-0.117 0.023q-0.188 0-0.352-0.141t-0.164-0.328v-14.672q2.016-1.5 5.531-1.5 3.469 0 5.484 1.5 2.016-1.5 5.484-1.5z"
    ]
  },
  statistics: {
    name: "statistics",
    viewBox: "0 0 32 32",
    paths: [
      "M0 26h32v4h-32zM4 18h4v6h-4zM10 10h4v14h-4zM16 16h4v8h-4zM22 4h4v20h-4z"
    ]
  },
  menu: {
    name: "menu",
    viewBox: "0 0 20 20",
    paths: ["M0 3h20v2h-20v-2zM0 9h20v2h-20v-2zM0 15h20v2h-20v-2z"]
  },
  score: {
    name: "score",
    viewBox: "0 0 32 32",
    paths: [
      "M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"
    ]
  },
  back: {
    name: "back",
    viewBox: "0 0 32 32",
    paths: [
      "M12.586 27.414l-10-10c-0.781-0.781-0.781-2.047 0-2.828l10-10c0.781-0.781 2.047-0.781 2.828 0s0.781 2.047 0 2.828l-6.586 6.586h19.172c1.105 0 2 0.895 2 2s-0.895 2-2 2h-19.172l6.586 6.586c0.39 0.39 0.586 0.902 0.586 1.414s-0.195 1.024-0.586 1.414c-0.781 0.781-2.047 0.781-2.828 0z"
    ]
  },
  today: {
    name: "today",
    viewBox: "0 0 24 24",
    paths: [
      "M6.984 9.984h5.016v5.016h-5.016v-5.016zM18.984 18.984v-10.969h-13.969v10.969h13.969zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.797 0.586-1.406t1.43-0.609h0.984v-2.016h2.016v2.016h7.969v-2.016h2.016v2.016h0.984z"
    ]
  },
  error_network: {
    name: "error_network",
    viewBox: "0 0 32 32",
    paths: [
      "M21.462 22h2.539c2.761 0 4.999-2.244 4.999-5 0-2.096-1.287-3.892-3.117-4.634v0c-0.523-2.493-2.734-4.366-5.383-4.366-0.863 0-1.679 0.199-2.406 0.553-1.203-2.121-3.481-3.553-6.094-3.553-3.866 0-7 3.134-7 7 0 0.138 0.004 0.275 0.012 0.412v0c-1.772 0.77-3.012 2.538-3.012 4.588 0 2.761 2.232 5 4.999 5h2.539l5.962-10 5.962 10zM15.5 14l6.5 11h-13l6.5-11zM15 18v3h1v-3h-1zM15 22v1h1v-1h-1z"
    ]
  },
  error: {
    name: "error",
    alias: ['warning'],
    viewBox: "0 0 32 32",
    paths: [
      "M28.359 23.597l-10.784-17.45c-0.869-1.403-2.281-1.406-3.15 0v0l-10.784 17.45c-1.166 1.884-0.319 3.403 1.888 3.403h20.944c2.203 0 3.050-1.522 1.887-3.403zM16 24c-0.553 0-1-0.447-1-1s0.447-1 1-1 1 0.447 1 1-0.447 1-1 1zM17 19.003c0 0.544-0.447 0.997-1 0.997-0.556 0-1-0.447-1-0.997v-6.006c0-0.544 0.447-0.997 1-0.997v0c0.556 0 1 0.447 1 0.997v6.006z"
    ]
  },
  info: {
    name: "info",
    viewBox: "0 0 20 20",
    paths: [
      "M10 0.4c-5.303 0-9.601 4.298-9.601 9.6 0 5.303 4.298 9.601 9.601 9.601 5.301 0 9.6-4.298 9.6-9.601s-4.299-9.6-9.6-9.6zM10.896 3.866c0.936 0 1.211 0.543 1.211 1.164 0 0.775-0.62 1.492-1.679 1.492-0.886 0-1.308-0.445-1.282-1.182 0-0.621 0.519-1.474 1.75-1.474zM8.498 15.75c-0.64 0-1.107-0.389-0.66-2.094l0.733-3.025c0.127-0.484 0.148-0.678 0-0.678-0.191 0-1.022 0.334-1.512 0.664l-0.319-0.523c1.555-1.299 3.343-2.061 4.108-2.061 0.64 0 0.746 0.756 0.427 1.92l-0.84 3.18c-0.149 0.562-0.085 0.756 0.064 0.756 0.192 0 0.82-0.232 1.438-0.719l0.362 0.486c-1.513 1.512-3.162 2.094-3.801 2.094z"
    ]
  },
  success: {
    name: "success",
    viewBox: "0 0 24 24",
    paths: [
      "M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563-1.406 1.406zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"
    ]
  },
  edit: {
    name: "edit",
    viewBox: "0 0 35 35",
    paths: [
      "M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"
    ]
  },
  archive: {
    name: "archive",
    viewBox: "0 0 32 32",
    paths: [
      "M27 13v15h-23v-15h23zM29 12v-7h-27v7h27zM12.997 18c-1.103 0-1.997 0.888-1.997 2 0 1.105 0.896 2 1.997 2h5.005c1.103 0 1.997-0.888 1.997-2 0-1.105-0.896-2-1.997-2h-5.005z"
    ]
  },
  unarchive: {
    name: "unarchive",
    viewBox: "0 0 32 32",
    paths: [
     "M18 8l-4-4h-14v26h32v-22h-14zM22 22h-4v4h-4v-4h-4v-4h4v-4h4v4h4v4z"
    ]
  },
  filter: {
    name: "filter",
    viewBox: "0 0 24 24",
    paths: [
      "M4.266 5.672q-0.281-0.328-0.281-0.656 0-0.422 0.305-0.727t0.727-0.305h13.969q0.422 0 0.727 0.305t0.305 0.727q0.047 0.281-0.234 0.609l-5.766 7.359v6q0 0.422-0.281 0.727t-0.703 0.305h-2.016q-0.422 0-0.727-0.305t-0.305-0.727v-6q-5.625-7.172-5.719-7.313z"
    ]
  },
  logout: {
    name: "logout",
    viewBox: "0 0 24 24",
    paths: [
      "M3.984 5.016v13.969h8.016v2.016h-8.016q-0.797 0-1.383-0.609t-0.586-1.406v-13.969q0-0.797 0.586-1.406t1.383-0.609h8.016v2.016h-8.016zM17.016 6.984l4.969 5.016-4.969 5.016-1.406-1.453 2.578-2.578h-10.172v-1.969h10.172l-2.578-2.625z"
    ]
  },
  tags: {
    name: "tags",
    viewBox: "0 0 40 32",
    paths: [
      "M38.5 0h-12c-0.825 0-1.977 0.477-2.561 1.061l-14.879 14.879c-0.583 0.583-0.583 1.538 0 2.121l12.879 12.879c0.583 0.583 1.538 0.583 2.121 0l14.879-14.879c0.583-0.583 1.061-1.736 1.061-2.561v-12c0-0.825-0.675-1.5-1.5-1.5zM31 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z",
      "M4 17l17-17h-2.5c-0.825 0-1.977 0.477-2.561 1.061l-14.879 14.879c-0.583 0.583-0.583 1.538 0 2.121l12.879 12.879c0.583 0.583 1.538 0.583 2.121 0l0.939-0.939-13-13z"
    ]
  },
  search: {
    name: "search",
    viewBox: "0 0 32 32",
    paths: [
      "M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
    ]
  },
  'light-mode': {
    name: "light-mode",
    viewBox: "0 0 32 32",
    paths: [
      "M8.031 16.5c0 4.143 3.358 7.5 7.5 7.5s7.5-3.357 7.5-7.5-3.357-7.5-7.5-7.5c-4.142 0-7.5 3.357-7.5 7.5zM15.531 3.75l-2.109 4.219h4.219l-2.11-4.219zM24.543 7.457l-4.475 1.491 2.982 2.983 1.493-4.474zM10.994 8.948l-4.474-1.491 1.491 4.475 2.983-2.984zM6.969 14.359l-4.219 2.11 4.219 2.109v-4.219zM24.031 18.641l4.219-2.109-4.219-2.109v4.218zM15.531 29.25l2.109-4.219h-4.219l2.11 4.219zM20.068 24.052l4.475 1.491-1.492-4.475-2.983 2.984zM6.52 25.543l4.475-1.491-2.983-2.983-1.492 4.474z"
    ]
  },
  'bell': {
    name: "bell",
    viewBox: '0 0 32 32',
    paths: [
      "M27 23h-22l-3 3v1l1 1h9c0 2.209 1.791 4 4 4s4-1.791 4-4h9l1-1v-1l-3-3zM26 15c0-4.1-2.47-7.618-6-9.162v-1.838c0-2.209-1.791-4-4-4s-4 1.791-4 4v1.838c-3.53 1.544-6 5.062-6 9.162v7h20v-7zM14 4c0-1.104 0.896-2 2-2s2 0.896 2 2h-4z"
    ]
  },
  'caret-down': {
    name: "caret-down",
    viewBox: '0 0 24 24',
    paths: [
      "M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z"
    ]
  },
  'dark-mode': {
    name: "dark-mode",
    viewBox: "0 0 32 32",
    paths: [
      "M10.895 7.574c0 7.55 5.179 13.67 11.567 13.67 1.588 0 3.101-0.38 4.479-1.063-1.695 4.46-5.996 7.636-11.051 7.636-6.533 0-11.83-5.297-11.83-11.83 0-4.82 2.888-8.959 7.023-10.803-0.116 0.778-0.188 1.573-0.188 2.39z"
    ]
  },
  'settings': {
    name: "settings",
    viewBox: "0 0 32 32",
    paths: [
      "M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"
    ]
  }
};

export type IconName = keyof typeof Icons & string;

export function getIconByName(name: IconName): IconDefinition | undefined {
  const icon = Icons[name];
  if(icon) {
    return icon;
  }

  for(const iconName in Icons) {
      if(Icons[iconName].alias?.includes(name)) {
        return Icons[iconName];
      }
  }
}

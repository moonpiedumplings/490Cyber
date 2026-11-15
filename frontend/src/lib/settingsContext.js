import { createContext, useContext } from 'react'

export const SETTINGS_KEY = 'cyberrange.settings'

export const DEFAULT_SETTINGS = {
  editorFontSize: 13,
  tabSize: 2,
  showLineNumbers: true,
  confirmDiscard: true,
}

export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  resetSettings: () => {},
})

export function useSettings() {
  return useContext(SettingsContext)
}

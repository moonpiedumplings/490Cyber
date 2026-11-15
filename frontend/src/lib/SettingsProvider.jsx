import { useCallback, useMemo, useState } from 'react'
import { readJSON, writeJSON } from './storage'
import { DEFAULT_SETTINGS, SETTINGS_KEY, SettingsContext } from './settingsContext'

// Settings are per-browser for now. Move to the user's profile once the
// backend has somewhere to store them.
export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...readJSON(SETTINGS_KEY, {}),
  }))

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      writeJSON(SETTINGS_KEY, next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    writeJSON(SETTINGS_KEY, DEFAULT_SETTINGS)
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const value = useMemo(
    () => ({ settings, updateSetting, resetSettings }),
    [settings, updateSetting, resetSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

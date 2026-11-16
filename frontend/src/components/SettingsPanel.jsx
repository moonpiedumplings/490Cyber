import { useEffect, useRef } from 'react'
import { useSettings } from '../lib/settingsContext'
import './SettingsPanel.css'

// SCRUM-106: panel opened by the settings button. Changes apply immediately
// and are stored in this browser (see SettingsProvider).
export default function SettingsPanel({ onClose }) {
  const { settings, updateSetting, resetSettings } = useSettings()
  const panelRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    panelRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="settings-backdrop" onMouseDown={onClose}>
      <aside
        ref={panelRef}
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 id="settings-title">Settings</h2>
          <button type="button" className="icon-button" aria-label="Close settings" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <section className="settings-section" aria-labelledby="settings-editor">
          <h3 id="settings-editor">Terraform editor</h3>

          <label className="settings-row">
            <span>Font size</span>
            <select
              value={settings.editorFontSize}
              onChange={(e) => updateSetting('editorFontSize', Number(e.target.value))}
            >
              {[12, 13, 14, 16, 18].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </label>

          <label className="settings-row">
            <span>Tab size</span>
            <select
              value={settings.tabSize}
              onChange={(e) => updateSetting('tabSize', Number(e.target.value))}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>

          <label className="settings-row">
            <span>Show line numbers</span>
            <input
              type="checkbox"
              checked={settings.showLineNumbers}
              onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
            />
          </label>

          <label className="settings-row">
            <span>Ask before discarding unsaved changes</span>
            <input
              type="checkbox"
              checked={settings.confirmDiscard}
              onChange={(e) => updateSetting('confirmDiscard', e.target.checked)}
            />
          </label>
        </section>

        <div className="settings-footer">
          <p>Saved in this browser only.</p>
          <button type="button" className="text-button" onClick={resetSettings}>
            Reset to defaults
          </button>
        </div>
      </aside>
    </div>
  )
}

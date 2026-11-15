import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSettings } from '../lib/settingsContext'
import { loadTerraform, saveTerraform } from '../lib/terraformStore'
import './TerraformEditor.css'

// SCRUM-111: buttons for editing/saving terraform (no backend yet).
//
// View mode:  [Edit]
// Edit mode:  [Cancel] [Save]   (Ctrl/Cmd+S also saves)
// Save is disabled until something changes; Cancel throws edits away
// (with a confirm, unless turned off in Settings).

function formatTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function TerraformEditor() {
  const { settings } = useSettings()
  const [initial] = useState(loadTerraform)

  const [saved, setSaved] = useState(initial.content) // last saved version
  const [draft, setDraft] = useState(initial.content) // what's in the textarea
  const [savedAt, setSavedAt] = useState(initial.savedAt)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const textareaRef = useRef(null)
  const gutterRef = useRef(null)
  const pendingCaret = useRef(null)

  const dirty = draft !== saved
  const lineCount = draft.split('\n').length

  const startEditing = () => {
    setError(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    if (dirty && settings.confirmDiscard && !window.confirm('Discard your unsaved terraform changes?')) {
      return
    }
    setDraft(saved)
    setError(null)
    setEditing(false)
  }

  const save = useCallback(async () => {
    if (!dirty || saving) return
    setSaving(true)
    setError(null)
    try {
      const result = await saveTerraform(draft)
      setSaved(draft)
      setSavedAt(result.savedAt)
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [dirty, saving, draft])

  // Focus the editor when entering edit mode.
  useEffect(() => {
    if (editing) textareaRef.current?.focus()
  }, [editing])

  // Ctrl/Cmd+S saves while editing.
  useEffect(() => {
    if (!editing) return
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editing, save])

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // Tab inserts spaces instead of moving focus (Shift+Tab / Esc still leave).
  const onEditorKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur()
      return
    }
    if (e.key !== 'Tab' || e.shiftKey) return
    e.preventDefault()
    const { selectionStart, selectionEnd } = e.currentTarget
    const spaces = ' '.repeat(settings.tabSize)
    const next = draft.slice(0, selectionStart) + spaces + draft.slice(selectionEnd)
    pendingCaret.current = selectionStart + spaces.length
    setDraft(next)
  }

  // Put the caret back after a Tab insert. Runs synchronously after React
  // writes the new value, before the next keystroke can land.
  useLayoutEffect(() => {
    if (pendingCaret.current === null || !textareaRef.current) return
    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pendingCaret.current
    pendingCaret.current = null
  }, [draft])

  const syncGutter = (e) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop
  }

  let status
  if (saving) status = { tone: 'busy', text: 'Saving…' }
  else if (error) status = { tone: 'error', text: error }
  else if (dirty) status = { tone: 'warn', text: 'Unsaved changes' }
  else if (editing) status = { tone: 'muted', text: 'Editing' }
  else if (savedAt) status = { tone: 'ok', text: `Saved ${formatTime(savedAt)}` }
  else status = { tone: 'muted', text: 'Default template' }

  return (
    <section className="tf-panel" aria-labelledby="tf-title">
      <div className="tf-header">
        <div className="tf-heading">
          <h2 id="tf-title">Range configuration</h2>
          <span className="tf-filename">main.tf</span>
        </div>

        <div className="tf-actions">
          <span className={`tf-status tf-status--${status.tone}`} role="status" aria-live="polite">
            {status.text}
          </span>

          {editing ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={cancelEditing} disabled={saving}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={save}
                disabled={!dirty || saving}
                title="Save (Ctrl/Cmd+S)"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={startEditing}>
              Edit
            </button>
          )}
        </div>
      </div>

      <div
        className={`tf-editor${editing ? ' is-editing' : ''}`}
        style={{ '--tf-font-size': `${settings.editorFontSize}px`, tabSize: settings.tabSize }}
      >
        {settings.showLineNumbers && (
          <div className="tf-gutter" ref={gutterRef} aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="tf-textarea"
          aria-label="Terraform configuration"
          value={draft}
          readOnly={!editing}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          wrap="off"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={editing ? onEditorKeyDown : undefined}
          onScroll={syncGutter}
        />
      </div>

      <p className="tf-footnote">
        {editing
          ? 'Tab indents · Esc leaves the editor · Ctrl/Cmd+S saves.'
          : 'Read-only. Click Edit to change the range configuration.'}{' '}
        Saved to this browser until the backend is ready.
      </p>
    </section>
  )
}

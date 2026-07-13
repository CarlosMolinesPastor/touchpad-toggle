# Touchpad Toggle — GNOME Shell Extension

## Project Type
Pure JavaScript GNOME Shell 50+ extension. No build step, no tests, no bundler.

## File Structure
| File | Purpose |
|------|---------|
| `extension.js` | Main entry point — enable/disable extension, bind shortcut |
| `prefs.js` | Preferences UI (libadwaita-based settings window) |
| `toggle.js` | Quick settings toggle (QuickMenuToggle) |
| `icon.js` | Optional status icon in quick settings |
| `types.js` | Constants: `TouchpadState`, `SETTINGS_SCHEMA_ID`, send-events values |
| `schemas/*.gschema.xml` | Extension settings schema (must compile after install) |

**Note**: Do not include `img/` folder in distribution (per GNOME review guidelines).

## Installation (from source)
```bash
cp -r * ~/.local/share/gnome-shell/extensions/touchpad-toggle-ext@CarlosMolinesPastor/
glib-compile-schemas ~/.local/share/gnome-shell/extensions/touchpad-toggle-ext@CarlosMolinesPastor/schemas/
```
Then restart GNOME Shell and enable with `gnome-extensions enable touchpad-toggle-ext@CarlosMolinesPastor`.

## Schema Compilation
After any change to `schemas/*.gschema.xml`, run:
```bash
glib-compile-schemas schemas/
```

## Extension UUID
`touchpad-toggle-ext@CarlosMolinesPastor`

## Preferences Command
```bash
gnome-extensions prefs touchpad-toggle-ext@CarlosMolinesPastor
```

## Key Technical Notes
- Uses ES module imports (`gi://Gio`, `gi://Adw`, `resource:///org/gnome/shell/...`)
- Settings schema for extension prefs: `org.gnome.shell.extensions.touchpad-toggle`
- Touchpad hardware setting path (read via `Gio.Settings`): `org.gnome.desktop.peripherals.touchpad`
- The shortcut is stored as a `strv` (string array) in settings; empty array = no shortcut
- Preferences window uses libadwaita (`Adw.PreferencesPage`, `Adw.SwitchRow`, etc.)

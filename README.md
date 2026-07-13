# Touchpad Toggle

A GNOME Shell 50+ extension that allows you to quickly toggle your touchpad on and off using a keyboard shortcut or the quick settings panel.

## Features

- **Quick Settings Toggle**: Enable or disable the touchpad directly from the GNOME quick settings menu
- **Keyboard Shortcut**: Toggle the touchpad with `Ctrl+Super+Alt+T`
- **Panel Indicator**: Optional icon showing the current touchpad state
- **Automatic External Mouse Detection**: Automatically disables the touchpad when an external mouse is connected (uses GNOME's built-in behavior)

## Installation

### From Source

```bash
git clone https://github.com/CarlosMolinesPastor/touchpad-toggle.git
cd touchpad-toggle
cp -r * ~/.local/share/gnome-shell/extensions/touchpad-toggle-ext@CarlosMolinesPastor/
glib-compile-schemas ~/.local/share/gnome-shell/extensions/touchpad-toggle-ext@CarlosMolinesPastor/schemas/
```

Then restart GNOME Shell (log out and log back in) and enable the extension using the GNOME Extensions app or:

```bash
gnome-extensions enable touchpad-toggle-ext@CarlosMolinesPastor
```

### From GNOME Shell Extensions Website

The extension is available at [GNOME Shell Extensions](https://extensions.gnome.org/) (link will be added upon approval).

## Usage

### Keyboard Shortcut

Press `Ctrl+Super+Alt+T` to toggle the touchpad on and off.

### Quick Settings

Click on the touchpad indicator in the quick settings panel to access the toggle menu:
- **Enabled**: Touchpad fully active
- **Disabled**: Touchpad turned off

### Preferences

Access the extension preferences to:
- Show/hide the panel indicator
- Configure the keyboard shortcut

Open preferences via:
```bash
gnome-extensions prefs touchpad-toggle-ext@CarlosMolinesPastor
```

## Requirements

- GNOME Shell 50 or later
- Gio.Settings (part of GLib)

## Building from Source

No build step required. This is a pure JavaScript/GObject extension.

To compile the settings schema:

```bash
glib-compile-schemas schemas/
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**CarlosMolinesPastor** - [GitHub](https://github.com/CarlosMolinesPastor)

## Acknowledgments

- Inspired by [touchpad@gpawru](https://github.com/gpawru/touchpad) - the original touchpad toggle extension
- Built following GNOME Shell extension best practices

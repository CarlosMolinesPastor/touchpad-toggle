import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const SCHEMA_ID = 'org.gnome.shell.extensions.touchpad-toggle';

export default class TouchpadTogglePrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Touchpad Toggle',
        });
        window.add(page);

        const generalGroup = new Adw.PreferencesGroup({
            title: 'General',
        });
        page.add(generalGroup);

        const showIndicator = new Adw.SwitchRow({
            title: 'Show indicator',
            subtitle: 'Show an icon in the quick settings panel',
        });
        generalGroup.add(showIndicator);
        settings.bind('show-indicator', showIndicator, 'active', Gio.SettingsBindFlags.DEFAULT);

        const shortcutGroup = new Adw.PreferencesGroup({
            title: 'Keyboard Shortcut',
            description: 'Assign a keyboard shortcut to toggle the touchpad',
        });
        page.add(shortcutGroup);

        const shortcutRow = new Adw.ActionRow({
            title: 'Toggle Touchpad',
        });

        const shortcutLabel = new Gtk.ShortcutLabel({
            accelerator: this._getCurrentShortcut(),
            hexpand: true,
            halign: Gtk.Align.END,
            valign: Gtk.Align.CENTER,
        });

        const setButton = new Gtk.Button({
            label: 'Set…',
            halign: Gtk.Align.END,
        });

        const resetButton = new Gtk.Button({
            icon_name: 'edit-clear-symbolic',
            tooltip_text: 'Reset',
            halign: Gtk.Align.END,
        });

        shortcutRow.add_suffix(shortcutLabel);
        shortcutRow.add_suffix(setButton);
        shortcutRow.add_suffix(resetButton);
        shortcutGroup.add(shortcutRow);

        setButton.connect('clicked', () => {
            this._showShortcutDialog(window, shortcutLabel, settings);
        });

        resetButton.connect('clicked', () => {
            settings.set_strv('shortcut', []);
            shortcutLabel.set_accelerator('');
        });

        settings.connect('changed::shortcut', () => {
            shortcutLabel.set_accelerator(this._getCurrentShortcut());
        });
    }

    _getCurrentShortcut() {
        const strv = this.getSettings().get_strv('shortcut');
        return strv.length > 0 ? strv[0] : '';
    }

    _showShortcutDialog(window, shortcutLabel, settings) {
        const dialog = new Gtk.Dialog({
            title: 'Set Shortcut',
            transient_for: window,
            modal: true,
            default_width: 420,
        });

        dialog.add_button('Cancel', Gtk.ResponseType.CANCEL);
        const okButton = dialog.add_button('Set', Gtk.ResponseType.OK);
        okButton.sensitive = false;

        const contentArea = dialog.get_content_area();
        const label = new Gtk.Label({
            label: 'Press the desired key combination…',
            margin_top: 30,
            margin_bottom: 20,
            wrap: true,
        });
        contentArea.append(label);

        let captured = '';

        const controller = new Gtk.EventControllerKey();
        controller.connect('key-pressed', (ctrl, keyval, keycode, state) => {
            const mods = state & Gtk.accelerator_get_default_mod_mask();
            const accelerator = this._formatAccelerator(keyval, mods);

            if (this._isOnlyModifiers(keyval)) {
                label.set_markup(`<span foreground="red">Invalid: ${accelerator}</span>\n<span size="small">You need a non-modifier key</span>`);
                okButton.sensitive = false;
                captured = '';
                return Gdk.EVENT_STOP;
            }

            if (mods === 0) {
                okButton.sensitive = false;
                captured = '';
                return Gdk.EVENT_STOP;
            }

            captured = accelerator;
            label.set_text(`Captured: ${captured}`);
            okButton.sensitive = true;
            return Gdk.EVENT_STOP;
        });

        dialog.add_controller(controller);

        dialog.connect('response', (_, responseId) => {
            if (responseId === Gtk.ResponseType.OK && captured) {
                settings.set_strv('shortcut', [captured]);
                shortcutLabel.set_accelerator(captured);
            }
            dialog.destroy();
        });

        dialog.show();
    }

    _formatAccelerator(keyval, mods) {
        let acc = '';
        if (mods & Gdk.ModifierType.CONTROL_MASK) acc += '<Control>';
        if (mods & Gdk.ModifierType.SHIFT_MASK) acc += '<Shift>';
        if (mods & Gdk.ModifierType.ALT_MASK) acc += '<Alt>';
        if (mods & Gdk.ModifierType.SUPER_MASK) acc += '<Super>';

        if (!this._isModifierKey(keyval)) {
            let keyStr = Gtk.accelerator_name(keyval, 0) || Gdk.keyval_name(keyval) || '';
            if (keyStr.length === 1 && /[a-z]/i.test(keyStr)) {
                keyStr = keyStr.toUpperCase();
            }
            acc += keyStr;
        }
        return acc || Gdk.keyval_name(keyval) || '';
    }

    _isModifierKey(keyval) {
        return [Gdk.KEY_Shift_L, Gdk.KEY_Shift_R, Gdk.KEY_Control_L, Gdk.KEY_Control_R,
                Gdk.KEY_Alt_L, Gdk.KEY_Alt_R, Gdk.KEY_Super_L, Gdk.KEY_Super_R].includes(keyval);
    }

    _isOnlyModifiers(keyval) {
        return this._isModifierKey(keyval);
    }
}

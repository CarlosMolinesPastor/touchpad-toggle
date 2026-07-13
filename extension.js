import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import { TouchpadToggle } from './toggle.js';
import { panel, wm } from 'resource:///org/gnome/shell/ui/main.js';
import { IconIndicator } from './icon.js';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import { SEND_EVENTS_DISABLED, SEND_EVENTS_DISABLED_ON_EXTERNAL_MOUSE, SEND_EVENTS_ENABLED, SETTINGS_SCHEMA_ID, TouchpadState } from './types.js';

const SHORTCUT_NAME = 'shortcut';

export default class TouchpadToggleExtension extends Extension {
    enable() {
        this.extensionSettings = this.getSettings();
        this.touchpadSettings = new Gio.Settings({ schema_id: SETTINGS_SCHEMA_ID });

        this._connections = [];

        this.enableToggleIndicator();

        if (this.extensionSettings.get_boolean('show-indicator')) {
            this.enableIconIndicator();
        }

        this.bindShortcut();

        this._connections.push(
            this.touchpadSettings.connect('changed::send-events', () => this.onTouchpadStateChange())
        );
        this._connections.push(
            this.extensionSettings.connect('changed::show-indicator', () => this.onIndicatorStateChange())
        );
    }

    disable() {
        this.unbindShortcut();
        this.disableToggleIndicator();
        this.disableIconIndicator();
        this._connections.forEach(id => {
            this.touchpadSettings.disconnect(id);
            this.extensionSettings.disconnect(id);
        });
        this._connections = [];
        this.extensionSettings = null;
        this.touchpadSettings = null;
    }

    bindShortcut() {
        if (!this.extensionSettings) return;
        wm.addKeybinding(SHORTCUT_NAME, this.extensionSettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW, () => this.toggleTouchpad());
    }

    unbindShortcut() {
        wm.removeKeybinding(SHORTCUT_NAME);
    }

    toggleTouchpad() {
        const currentState = this.getTouchpadState();
        let newState;
        switch (currentState) {
            case TouchpadState.Enabled:
                newState = TouchpadState.Disabled;
                break;
            case TouchpadState.Disabled:
            case TouchpadState.MouseOnly:
                newState = TouchpadState.Enabled;
                break;
        }
        this.updateSendEventsSetting(newState);
    }

    getTouchpadState() {
        const sendEvents = this.touchpadSettings.get_string('send-events');
        switch (sendEvents) {
            case SEND_EVENTS_DISABLED:
                return TouchpadState.Disabled;
            case SEND_EVENTS_DISABLED_ON_EXTERNAL_MOUSE:
                return TouchpadState.MouseOnly;
            default:
                return TouchpadState.Enabled;
        }
    }

    updateSendEventsSetting(state) {
        let value;
        switch (state) {
            case TouchpadState.Disabled:
                value = SEND_EVENTS_DISABLED;
                break;
            case TouchpadState.MouseOnly:
                value = SEND_EVENTS_DISABLED_ON_EXTERNAL_MOUSE;
                break;
            default:
                value = SEND_EVENTS_ENABLED;
        }
        this.touchpadSettings.set_string('send-events', value);
    }

    onIndicatorStateChange() {
        const state = this.extensionSettings.get_boolean('show-indicator');
        if (state) {
            this.enableIconIndicator();
        } else {
            this.disableIconIndicator();
        }
    }

    onTouchpadStateChange() {
        const state = this.getTouchpadState();
        if (this.iconIndicator) {
            this.iconIndicator.updateState(state);
        }
        if (this.toggleIndicator && this.toggleIndicator.quickSettingsItems[0]) {
            this.toggleIndicator.quickSettingsItems[0].updateState(state);
        }
    }

    enableToggleIndicator() {
        if (!this.toggleIndicator) {
            const toggle = new TouchpadToggle();
            toggle.updateState(this.getTouchpadState());
            this._connections.push(
                toggle.connect('state-updated', (_, state) => this.updateSendEventsSetting(state))
            );
            this.toggleIndicator = new SystemIndicator();
            this.toggleIndicator.quickSettingsItems.push(toggle);
            panel.statusArea.quickSettings.addExternalIndicator(this.toggleIndicator);
        }
    }

    disableToggleIndicator() {
        if (this.toggleIndicator) {
            this.toggleIndicator.quickSettingsItems.forEach((item) => item.destroy());
            this.toggleIndicator.destroy();
            this.toggleIndicator = null;
        }
    }

    enableIconIndicator() {
        if (!this.iconIndicator) {
            this.iconIndicator = new IconIndicator();
            panel.statusArea.quickSettings.addExternalIndicator(this.iconIndicator);
            this.iconIndicator.updateState(this.getTouchpadState());
        }
    }

    disableIconIndicator() {
        if (this.iconIndicator) {
            this.iconIndicator.quickSettingsItems.forEach((item) => item.destroy());
            this.iconIndicator.destroy();
            this.iconIndicator = null;
        }
    }
}

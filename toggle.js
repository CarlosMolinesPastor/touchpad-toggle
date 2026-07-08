import GObject from 'gi://GObject';
import { QuickMenuToggle } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import { Ornament, PopupImageMenuItem } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import { TouchpadState } from './types.js';

const TOGGLE_TITLE = 'Touchpad';
const TOGGLE_SUBTITLE_ENABLED = 'Enabled';
const TOGGLE_SUBTITLE_DISABLED = 'Disabled';
const POPUP_HEADER_TITLE = 'Touchpad settings';
const POPUP_OPTION_ENABLED = 'Enabled';
const POPUP_OPTION_DISABLED = 'Disabled';
const ICON_TOUCHPAD = 'input-touchpad-symbolic';
const ICON_TOUCHPAD_DISABLED = 'touchpad-disabled-symbolic';

const MODIFY_STATE = true;

export const TouchpadToggle = GObject.registerClass({
    GTypeName: 'MyTouchpadToggle',
    Signals: {
        'state-updated': {
            param_types: [GObject.TYPE_INT],
        },
    },
}, class TouchpadToggle extends QuickMenuToggle {
    lastDisabledState;

    constructor() {
        super({
            title: TOGGLE_TITLE,
            subtitle: '',
            iconName: ICON_TOUCHPAD,
            toggleMode: true,
        });
        this.lastDisabledState = TouchpadState.Disabled;
        this.connect('clicked', () => this.switchClicked());

        this.enabledOption = new PopupImageMenuItem(POPUP_OPTION_ENABLED, ICON_TOUCHPAD);
        this.enabledOption.connect('activate', () => this.switchTo(TouchpadState.Enabled, MODIFY_STATE));

        this.disabledOption = new PopupImageMenuItem(POPUP_OPTION_DISABLED, ICON_TOUCHPAD_DISABLED);
        this.disabledOption.connect('activate', () => this.switchTo(TouchpadState.Disabled, MODIFY_STATE));

        this.menu.addMenuItem(this.enabledOption);
        this.menu.addMenuItem(this.disabledOption);
    }

    updateState(state) {
        switch (state) {
            case TouchpadState.Disabled:
                this.switchTo(state);
                break;
            default:
                this.switchTo(TouchpadState.Enabled);
        }
    }

    switchClicked() {
        if (this.checked) {
            this.switchTo(TouchpadState.Enabled, MODIFY_STATE);
        } else {
            this.switchTo(TouchpadState.Disabled, MODIFY_STATE);
        }
    }

    switchTo(option, modifySettingsState = false) {
        this.enabledOption.setOrnament(option === TouchpadState.Enabled ? Ornament.CHECK : Ornament.NONE);
        this.disabledOption.setOrnament(option === TouchpadState.Disabled ? Ornament.CHECK : Ornament.NONE);

        switch (option) {
            case TouchpadState.Disabled:
                this.subtitle = TOGGLE_SUBTITLE_DISABLED;
                this.iconName = ICON_TOUCHPAD_DISABLED;
                this.checked = false;
                this.lastDisabledState = TouchpadState.Disabled;
                break;
            default:
                this.subtitle = TOGGLE_SUBTITLE_ENABLED;
                this.iconName = ICON_TOUCHPAD;
                this.checked = true;
        }
        if (modifySettingsState) {
            this.emit('state-updated', option);
        }
    }
});

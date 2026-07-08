import GObject from 'gi://GObject';
import { SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import { TouchpadState } from './types.js';

const ICON_TOUCHPAD = 'input-touchpad-symbolic';
const ICON_TOUCHPAD_DISABLED = 'touchpad-disabled-symbolic';

export const IconIndicator = GObject.registerClass({
    GTypeName: 'MyTouchpadIconIndicator',
}, class IconIndicator extends SystemIndicator {
    _indicator;

    constructor() {
        super();
        this._indicator = this._addIndicator();
    }

    updateState(state) {
        switch (state) {
            case TouchpadState.Disabled:
                this._indicator.icon_name = ICON_TOUCHPAD_DISABLED;
                break;
            default:
                this._indicator.icon_name = ICON_TOUCHPAD;
        }
    }
});

export const SETTINGS_SCHEMA_ID = 'org.gnome.desktop.peripherals.touchpad';
export const SEND_EVENTS_DISABLED = 'disabled';
export const SEND_EVENTS_DISABLED_ON_EXTERNAL_MOUSE = 'disabled-on-external-mouse';
export const SEND_EVENTS_ENABLED = 'enabled';

export var TouchpadState;
(function (TouchpadState) {
    TouchpadState[TouchpadState["Disabled"] = 0] = "Disabled";
    TouchpadState[TouchpadState["MouseOnly"] = 1] = "MouseOnly";
    TouchpadState[TouchpadState["Enabled"] = 2] = "Enabled";
})(TouchpadState || (TouchpadState = {}));

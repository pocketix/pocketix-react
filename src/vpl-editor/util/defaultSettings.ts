import {EditorSettings} from "../model/editor-settings.model";

const defaultSettings = {
	menu: {
		enabled: true,
		enableToggleVisual: true,
		enableSaveVisual: true,
		enableUndo: true,
		enableRedo: true,
		enableSync: true,
		enableSaveText: true,
		enableToggleText: true,
		enableLang: true,
	},
	visualEditor: {
		enabled: true,
	},
	textEditor: {
		enabled: true,
		style: {},
	},
	common: {
		manualSync: false,
	},
} as EditorSettings;

export {defaultSettings};

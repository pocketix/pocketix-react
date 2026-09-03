type EditorSettings = {
  menu?: MenuSettings,
  visualEditor?: VisualEditorSettings,
  textEditor?: TextEditorSettings
  analytics?: AnalyticsSettings
  common: {
    manualSync: boolean
  }
}

type AnalyticsSettings = {
  enabled: boolean
}

type MenuSettings = {
  enabled: boolean,
  enableToggleVisual: boolean,
  enableSaveVisual: boolean,
  enableUndo: boolean,
  enableRedo: boolean,
  enableSync: boolean,
  enableSaveText: boolean,
  enableToggleText: boolean,
  enableLang: boolean
}

type VisualEditorSettings = {
  enabled: boolean
}

type TextEditorSettings = {
  enabled: boolean,
  style: {
    [cssClass: string]: any;
  }
}

export type { EditorSettings, MenuSettings, VisualEditorSettings, TextEditorSettings, AnalyticsSettings };

type EditorSettings = {
  menu?: MenuSettings,
  visualEditor?: VisualEditorSettings,
  textEditor?: TextEditorSettings
  common: {
    manualSync: boolean
  }
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

export type { EditorSettings, MenuSettings, VisualEditorSettings, TextEditorSettings };

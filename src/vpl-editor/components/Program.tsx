import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { Block } from "./Block";
import { Program as ProgramModel, Block as BlockModel } from "../model/language.model";
import { Language } from "../model/meta-language.model";
import { TextEditor } from "./TextEditor";
import "./Program.css";
import { ReactNode, useState } from "react";
import { EditorSettings, TextEditorSettings, VisualEditorSettings } from "../model/editor-settings.model";
import { defaultSettings } from "../util/defaultSettings";
import { generateIds, removeIds } from "../util/makeId";
import { preventDefaults } from "../util/preventDefaults";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";

const Program = (props: {
  program: ProgramModel,
  language: Language,
  level: number,
  onProgramChange: CallableFunction,
  settings?: EditorSettings,
  menu?: ReactNode
}) => {
  const [program, setProgram] = useState(generateIds(props.program));
  const [settings, setSettings] = useState(props?.settings ?? defaultSettings);
  const [language, setLanguage] = useState(props.language);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [languageString, setLanguageString] = useState(JSON.stringify(language, null, 2));
  const [languageSyntaxError, setLanguageSyntaxError] = useState(false);
  const [timer, setTimer] = useState(undefined as NodeJS.Timeout | undefined);

  const [undoList, setUndoList] = useState([] as string[]);
  const [redoList, setRedoList] = useState([] as string[]);

  const onEnableToggleVisual = () => {
    const visualEditorSettings = {
      ...settings.visualEditor,
      enabled: !settings.visualEditor?.enabled
    } as VisualEditorSettings

    setSettings({
      ...settings,
      visualEditor: visualEditorSettings
    })
  };

  const onEnableToggleText = () => {
    const testEditorSettings = {
      ...settings.textEditor,
      enabled: !settings.textEditor?.enabled
    } as TextEditorSettings

    setSettings({
      ...settings,
      textEditor: testEditorSettings
    })
  };

  const onToggleManualSync = () => {
    setSettings({
      ...settings,
      common: {
        ...settings.common,
        manualSync: !settings.common.manualSync
      }
    });
  };

  const undo = () => {
    setRedoList([...redoList, JSON.stringify(program)]);
    const newUndoList = [...undoList];
    const undoneProgram = (JSON.parse(newUndoList.pop() as string));
    setProgram(undoneProgram);
    setUndoList(newUndoList);
  };

  const redo = () => {
    setUndoList([...undoList, JSON.stringify(program)]);
    const newRedoList = [...redoList];
    const redoneProgram = (JSON.parse(newRedoList.pop() as string));
    setProgram(redoneProgram);
    setRedoList(newRedoList);
  };

  const updateProgram = (newProgramRaw: ProgramModel) => {
    const newProgram = generateIds(newProgramRaw);

    const newUndoList = [...undoList, JSON.stringify(program)];
    setUndoList(newUndoList);

    if (redoList.length) {
      setRedoList([]);
    }

    setProgram(newProgram);
  };

  const header = <span>Language</span>;
  const confirmLanguageDialog = () => {
    setDialogVisible(false);
    clearTimeout(timer);
    setTimer(undefined);

    const newLanguage = checkLanguage();

    if (newLanguage) {
      setLanguage(newLanguage);
    }
  };

  const cancelUpdateDialog = () => {
    setDialogVisible(false);
    clearTimeout(timer);
    setTimer(undefined);
  };

  const footer = <>
    <Button icon="pi pi-check" label="Ok" disabled={languageSyntaxError} onClick={confirmLanguageDialog}/>
    <Button icon="pi pi-times" label="Cancel" onClick={cancelUpdateDialog}/>
  </>

  const checkLanguage = () => {
    try {
      const language = JSON.parse(languageString);
      setLanguageSyntaxError(false);
      console.log("valid", language);
      return language;
    } catch (e) {
      setLanguageSyntaxError(true);
    }
  };

  const updateLanguageAndTriggerCheck = (value: string) => {
    setLanguageString(value);

    if (timer) {
      clearTimeout(timer);
    }

    setTimer(setTimeout(() => {
      checkLanguage();
      setTimer(undefined);
    }, 1000));
  };

  return (
    <>
      <div className="menu">
        <div className="menu-left">
          {settings.menu?.enableToggleVisual ? <ToggleButton className="toggle-desktop" onIcon="pi pi-palette" offIcon="pi pi-palette" offLabel="&nbsp;" onLabel="&nbsp;"
                                                             checked={settings.visualEditor?.enabled} onClick={onEnableToggleVisual} /> : <></>}
          {settings.menu?.enableToggleVisual ?
            <ToggleButton className="toggle-mobile" onIcon="pi pi-palette" offIcon="pi pi-palette" /> : <></>}
          {settings.menu?.enableSaveVisual ? <Button icon="pi pi-save" disabled={!settings.common.manualSync}></Button> : <></>}
        </div>

        <div className="menu-center">
          {settings.menu?.enableUndo ? <Button icon="pi pi-undo" disabled={undoList.length < 1} onClick={undo}></Button> : <></>}
          {settings.menu?.enableRedo ? <Button icon="pi pi-refresh" disabled={redoList.length < 1} onClick={redo}></Button> : <></>}
          {settings.menu?.enableLang ? <Button icon="pi pi-cog" onClick={() => setDialogVisible(true)}></Button> : <></>}
          {settings.menu?.enableSync ?
            <ToggleButton onIcon="pi pi-sync" offIcon="pi pi-sync" checked={settings.common.manualSync}
                          onClick={onToggleManualSync} onLabel="&nbsp;" offLabel="&nbsp;"/> : <></>}
          {props?.menu ? props?.menu : ""}
        </div>

        <div className="menu-right">
          {settings.menu?.enableSaveText ? <Button icon="pi pi-save" disabled={!settings.common.manualSync}></Button> : <></>}
          {settings.menu?.enableToggleText ?
            <ToggleButton checked={settings.textEditor?.enabled} onClick={onEnableToggleText} offLabel="&nbsp;" onLabel="&nbsp;"
                          className="toggle-desktop" onIcon="pi pi-code" offIcon="pi pi-code" /> : <></>}
          {settings.menu?.enableToggleText ?
            <ToggleButton className="toggle-mobile" onIcon="pi pi-code" offIcon="pi pi-code" /> : <></>}
        </div>
      </div>

      <div className="program">
        {settings.visualEditor?.enabled ? <div className="visual-editor">
          <Block block={program.block} language={language} level={0}
                 onUpdate={(block: BlockModel) => updateProgram({...program, block})} key={JSON.stringify(program)}/>
        </div> : <></>}
        {settings.textEditor?.enabled ? <div className="text-editor mobile-open">
          <TextEditor program={removeIds(program)}
                      onProgramChange={(newProgram: ProgramModel) => updateProgram({...newProgram})} key={JSON.stringify(program)}/>
        </div> : <></>}
      </div>

      <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} draggable={false} resizable={false}
              onClick={preventDefaults} dismissableMask={true} onMaskClick={(e) => preventDefaults(e.nativeEvent)} header={header}
              footer={footer}>
        <InputTextarea value={languageString} style={settings.textEditor?.style} className={`lang-text-area ${languageSyntaxError ? "error" : ""}`}
                       onChange={(e) => updateLanguageAndTriggerCheck(e.target.value)} rows={5} cols={30}/>
      </Dialog>
    </>
  );
};

export { Program };

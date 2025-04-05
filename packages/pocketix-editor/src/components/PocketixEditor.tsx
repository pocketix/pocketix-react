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
import { PrimeReactProvider } from "primereact/api";

const PocketixEditor = (props: {
  program: ProgramModel,
  language: Language,
  level: number,
  onProgramChange: CallableFunction,
  settings?: EditorSettings,
  menu?: ReactNode
}) => {
  const programWithIds = generateIds(props.program);
  const [program, setProgram] = useState(programWithIds);
  const [visualProgram, setVisualProgram] = useState(programWithIds);
  const [textProgram, setTextProgram] = useState(props.program);
  const [settings, setSettings] = useState(props?.settings ?? defaultSettings);
  const [language, setLanguage] = useState(props.language);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [languageString, setLanguageString] = useState(JSON.stringify(language, null, 2));
  const [languageSyntaxError, setLanguageSyntaxError] = useState(false);
  const [timer, setTimer] = useState(undefined as NodeJS.Timeout | undefined);

  const [undoList, setUndoList] = useState([] as string[]);
  const [redoList, setRedoList] = useState([] as string[]);

  const [mobileClosedVisualEditor, setMobileClosedVisualEditor] = useState(false);

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
    setAllPrograms(undoneProgram);
    setUndoList(newUndoList);
  };

  const redo = () => {
    setUndoList([...undoList, JSON.stringify(program)]);
    const newRedoList = [...redoList];
    const redoneProgram = (JSON.parse(newRedoList.pop() as string));
    setAllPrograms(redoneProgram);
    setRedoList(newRedoList);
  };

  const updateProgram = (newProgramRaw: ProgramModel) => {
    const newProgram = generateIds(newProgramRaw);

    const newUndoList = [...undoList, JSON.stringify(program)];
    setUndoList(newUndoList);

    if (redoList.length) {
      setRedoList([]);
    }

    setAllPrograms(newProgram);
  };

  const updateVisualProgram = (newProgram: ProgramModel) => {
    setVisualProgram(newProgram);

    if (!settings.common.manualSync) {
      updateProgram(newProgram);
    }
  }

  const updateTextProgram = (newProgram: ProgramModel) => {
    setTextProgram(newProgram);

    if (!settings.common.manualSync) {
      updateProgram(newProgram);
    }
  }

  const setAllPrograms = (newProgram: ProgramModel) => {
    setProgram(newProgram);
    setVisualProgram(newProgram);
    setTextProgram(removeIds(newProgram));
    props.onProgramChange(newProgram);
  }

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
    <Button  icon="pi pi-check" label="Ok" disabled={languageSyntaxError} onClick={confirmLanguageDialog}/>
    <Button  icon="pi pi-times" label="Cancel" onClick={cancelUpdateDialog}/>
  </>

  const checkLanguage = () => {
    try {
      const language = JSON.parse(languageString);
      setLanguageSyntaxError(false);
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
    <PrimeReactProvider>
      <div className="menu">
        <div className="menu-left">
          {settings.menu?.enableToggleVisual ? <Button className="toggle-desktop" icon="pi pi-palette" severity={settings.visualEditor?.enabled ? "info" : "secondary"}
                                                             onClick={onEnableToggleVisual} /> : <></>}
          {settings.menu?.enableToggleVisual ? <Button className="toggle-mobile" icon="pi pi-palette" severity={!mobileClosedVisualEditor ? "info" : "secondary"}
                                                             onClick={() => setMobileClosedVisualEditor(!mobileClosedVisualEditor)} /> : <></>}
          {settings.menu?.enableSaveVisual ? <Button  icon="pi pi-save" disabled={!settings.common.manualSync} onClick={() => updateProgram({...visualProgram})}></Button> : <></>}
        </div>

        <div className="menu-center">
          {settings.menu?.enableUndo ? <Button  icon="pi pi-undo" disabled={undoList.length < 1} onClick={undo}></Button> : <></>}
          {settings.menu?.enableRedo ? <Button  icon="pi pi-refresh" disabled={redoList.length < 1} onClick={redo}></Button> : <></>}
          {settings.menu?.enableLang ? <Button  icon="pi pi-cog" onClick={() => setDialogVisible(true)}></Button> : <></>}
          {settings.menu?.enableSync ? <Button  icon="pi pi-sync" severity={settings.common.manualSync ? "info" : "secondary"} onClick={onToggleManualSync}/> : <></>}
          {props?.menu ? props?.menu : ""}
        </div>

        <div className="menu-right">
          {settings.menu?.enableSaveText ? <Button  icon="pi pi-save" disabled={!settings.common.manualSync}
                                                   onClick={() => updateProgram({...textProgram})}></Button> : <></>}
          {settings.menu?.enableToggleText ?
            <Button severity={settings.textEditor?.enabled ? "info" : "secondary"} onClick={onEnableToggleText}
                          className="toggle-desktop" icon="pi pi-code" /> : <></>}
          {settings.menu?.enableToggleText ?
            <Button severity={mobileClosedVisualEditor ? "info" : "secondary"} onClick={() => setMobileClosedVisualEditor(!mobileClosedVisualEditor)}
                          className="toggle-mobile" icon="pi pi-code" /> : <></>}
        </div>
      </div>

      <div className="program">
        {settings.visualEditor?.enabled ? <div className={`visual-editor ${!mobileClosedVisualEditor ? "mobile-open" : ""}`}>
          <Block block={visualProgram.block} language={language} level={0}
                 onUpdate={(block: BlockModel) => updateVisualProgram({...program, block})}/>
        </div> : <></>}
        {settings.textEditor?.enabled ? <div className={`text-editor ${mobileClosedVisualEditor ? "mobile-open" : ""}`}>
          <TextEditor program={textProgram}
                      onProgramChange={(newProgram: ProgramModel) => updateTextProgram({...newProgram})}/>
        </div> : <></>}
      </div>

      <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} draggable={false} resizable={false} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}
              onClick={preventDefaults} dismissableMask={true} onMaskClick={(e) => preventDefaults(e.nativeEvent)} header={header}
              footer={footer}>
        <InputTextarea value={languageString} style={settings.textEditor?.style} className={`lang-text-area ${languageSyntaxError ? "error" : ""}`}
                       onChange={(e) => updateLanguageAndTriggerCheck(e.target.value)} rows={5} cols={30}/>
      </Dialog>
    </PrimeReactProvider>
  );
};

export { PocketixEditor };

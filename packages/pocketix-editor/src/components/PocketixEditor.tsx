import { Button } from "primereact/button";
import { Block } from "./Block";
import { Program as ProgramModel, Block as BlockModel } from "../model/language.model";
import { Language } from "../model/meta-language.model";
import { TextEditor } from "./TextEditor";
import "./Program.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import { EditorSettings, TextEditorSettings, VisualEditorSettings } from "../model/editor-settings.model";
import { defaultSettings } from "../util/defaultSettings";
import { generateIds, removeIds } from "../util/makeId";
import { preventDefaults } from "../util/preventDefaults";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { PrimeReactProvider } from "primereact/api";
import { captureAnalyticsEvent, setAnalyticsConsent } from "../util/analytics";
import { hasStoredConsent, storeConsent } from "../util/analyticsConsent";
import { time } from "console";

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
  const [language, setLanguage] = useState(props.language);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState(() => hasStoredConsent());
  const [languageString, setLanguageString] = useState(JSON.stringify(language, null, 2));
  const [languageSyntaxError, setLanguageSyntaxError] = useState(false);
  const [timer, setTimer] = useState(undefined as NodeJS.Timeout | undefined);

  const [undoList, setUndoList] = useState([] as string[]);
  const [redoList, setRedoList] = useState([] as string[]);

  const [mobileClosedVisualEditor, setMobileClosedVisualEditor] = useState(false);

  const [settings, setSettings] = useState(() => {
    const baseSettings = props?.settings ?? defaultSettings;
    return {
      ...baseSettings,
      textEditor: {
        ...baseSettings.textEditor,
        enabled: false
      }
    };
  });

  const analyticsEnabled = settings.analytics?.enabled ?? false;
  const isAgreeVisible = analyticsEnabled && !hasConsented;

  useEffect(() => {
    setAnalyticsConsent(analyticsEnabled && hasConsented);
  }, [analyticsEnabled, hasConsented]);

  const previousSettingsProp = useRef(props.settings);
  const previousProgramProp = useRef(props.program);

  useEffect(() => {
    // Compare the raw incoming prop against the raw prop we last processed -
    // NOT a freshly regenerated-ids version against the (already id-ful)
    // local state. generateIds() assigns new random ids to any id-less node
    // on every call, so comparing two independently-regenerated versions of
    // an id-less program would almost always "differ" even though
    // props.program itself never changed, causing a spurious resync/remount
    // shortly after every mount.
    if (JSON.stringify(props.program) === JSON.stringify(previousProgramProp.current)) {
      return;
    }

    previousProgramProp.current = props.program;

    const incomingProgram = generateIds(props.program);
    setProgram(incomingProgram);
    setVisualProgram(incomingProgram);
    setTextProgram(props.program);
  }, [props.program]);

  useEffect(() => {
    setLanguage(props.language);
  }, [props.language]);

  useEffect(() => {
    if (JSON.stringify(props.settings) === JSON.stringify(previousSettingsProp.current)) {
      return;
    }

    previousSettingsProp.current = props.settings;

    const baseSettings = props.settings ?? defaultSettings;
    setSettings({
      ...baseSettings,
      textEditor: {
        ...baseSettings.textEditor,
        enabled: false
      }
    });
  }, [props.settings]);

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

    captureAnalyticsEvent('toggled_manual_sync', {
      enabled: !settings.common.manualSync,
      timestamp: new Date().toISOString(),
      vpl_version: 'vpl_old'
    });
  };

  const undo = () => {
    captureAnalyticsEvent('undo_action', {
      timestamp: new Date().toISOString(),
      vpl_version: 'vpl_old'
    });

    setRedoList([...redoList, JSON.stringify(program)]);
    const newUndoList = [...undoList];
    const undoneProgram = (JSON.parse(newUndoList.pop() as string));
    setAllPrograms(undoneProgram);
    setUndoList(newUndoList);
  };

  const redo = () => {
    captureAnalyticsEvent('redo_action', {
      timestamp: new Date().toISOString(),
      vpl_version: 'vpl_old'
    });

    setUndoList([...undoList, JSON.stringify(program)]);
    const newRedoList = [...redoList];
    const redoneProgram = (JSON.parse(newRedoList.pop() as string));
    setAllPrograms(redoneProgram);
    setRedoList(newRedoList);
  };

  const handleAgreeClose = () => {
    storeConsent();
    setAnalyticsConsent(true);
    captureAnalyticsEvent('data_analysis_agreed', {
      timestamp: new Date().toISOString(),
      vpl_version: 'vpl_old'
    });
    setHasConsented(true);
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

      {analyticsEnabled ?
        <Dialog
          header="Souhlas se zpracováním dat"
          visible={isAgreeVisible}
          style={{ width: '550px' }}
          modal
          onHide={() => {}}
          contentStyle={{ padding: '1.5rem 2rem'}}
          closable={false}
          draggable={false}
          resizable={false}
          footer={
            <div>
              <Button label="Souhlasím" icon="pi pi-check" onClick={handleAgreeClose} autoFocus />
            </div>
          }
        >
          <p className="m-0">
            Souhlasím se zpracováním údajů o mém pohybu na stránce pro účely analytiky a vylepšení aplikace.
            <br /><br />
            Veškerá data jsou anonymizována a slouží pouze k technickému zdokonalení nástroje.
          </p>
        </Dialog> : <></>}
    </PrimeReactProvider>
  );
};

export { PocketixEditor };

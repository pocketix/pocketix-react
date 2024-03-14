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

  return (
    <>
      <div className="menu">
        <div className="menu-left">
          {settings.menu?.enableToggleVisual ? <ToggleButton className="toggle-desktop" onIcon="pi pi-palette" offIcon="pi pi-palette" offLabel="&nbsp;" onLabel="&nbsp;"
                                                             checked={settings.visualEditor?.enabled} onClick={onEnableToggleVisual} /> : <></>}
          {settings.menu?.enableToggleVisual ?
            <ToggleButton className="toggle-mobile" onIcon="pi pi-palette" offIcon="pi pi-palette" /> : <></>}
          {settings.menu?.enableSaveVisual ? <Button icon="pi pi-save"></Button> : <></>}
        </div>

        <div className="menu-center">
          {settings.menu?.enableUndo ? <Button icon="pi pi-undo" disabled={undoList.length < 1} onClick={undo}></Button> : <></>}
          {settings.menu?.enableRedo ? <Button icon="pi pi-refresh" disabled={redoList.length < 1} onClick={redo}></Button> : <></>}
          {settings.menu?.enableSync ? <Button icon="pi pi-cog"></Button> : <></>}
          {settings.menu?.enableLang ?
            <ToggleButton className="toggle-mobile" onIcon="pi pi-sync" offIcon="pi pi-sync" /> : <></>}
          {props?.menu ? props?.menu : ""}
        </div>

        <div className="menu-right">
          {settings.menu?.enableSaveText ? <Button icon="pi pi-save"></Button> : <></>}
          {settings.menu?.enableToggleText ?
            <ToggleButton checked={settings.textEditor?.enabled} onClick={onEnableToggleText} offLabel="&nbsp;" onLabel="&nbsp;"
                          className="toggle-desktop" onIcon="pi pi-code" offIcon="pi pi-code" /> : <></>}
          {settings.menu?.enableToggleText ?
            <ToggleButton className="toggle-mobile" onIcon="pi pi-code" offIcon="pi pi-code" /> : <></>}
        </div>
      </div>

      <div className="program">
        {settings.visualEditor?.enabled ? <div className="visual-editor">
          <Block block={program.block} language={props.language} level={0}
                 onUpdate={(block: BlockModel) => updateProgram({...program, block})} key={JSON.stringify(program)}/>
        </div> : <></>}
        {settings.textEditor?.enabled ? <div className="text-editor mobile-open">
          <TextEditor program={removeIds(program)}
                      onProgramChange={(newProgram: ProgramModel) => updateProgram({...newProgram})} key={JSON.stringify(program)}/>
        </div> : <></>}
      </div>
    </>
  );
};

export { Program };

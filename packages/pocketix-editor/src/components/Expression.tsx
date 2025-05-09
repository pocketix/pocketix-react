import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";
import "./Expression.css";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Language, Variable } from "../model/meta-language.model";
import { InputText } from "primereact/inputtext";
import { preventDefaults } from "../util/preventDefaults";

const Expression = (props: {
  language: Language,
  expressionValue?: string,
  color: string,
  backgroundColor: string,
  onExpressionValueChanged?: CallableFunction
}) => {
  const variables = props.language.variables;
  const [visible, setVisible] = useState(false);
  const [syntaxError] = useState(false);
  const [expressionString, setExpressionString] = useState(props.expressionValue?.toString() ? props.expressionValue : "");
  const [selectedVariable, setSelectedVariable] = useState({} as Variable);
  const textAreaRef = useRef({} as HTMLTextAreaElement);

  const addVariable = () => {
    if (!selectedVariable.label)
      return;

    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;

    const newString = expressionString.substring(0, start) + selectedVariable.label + expressionString.substring(end, expressionString.length);
    setExpressionString(newString);
  };

  const updateExpression = (value: string) => {
    setExpressionString(value);
  };

  const setExpressionAndClose = () => {
    updateExpression(expressionString);
    props.onExpressionValueChanged?.(expressionString);
    setVisible(false);
  };

  const onBlur = (value: string) => {
    updateExpression(value);
    props.onExpressionValueChanged?.(expressionString);
    setVisible(false);
  };

  const footer = <>
    <Button  label="Cancel" icon="pi pi-times" disabled={syntaxError} onClick={() => setVisible(false)}
            className="p-button-text" />
    <Button  label="Ok" icon="pi pi-check" onClick={setExpressionAndClose} autoFocus />
  </>;

  const header = <>
    <span>Expression</span>
  </>;

  return (
    <>
      <div className="p-inputgroup">
        <InputText className="input-field" value={expressionString} onChange={(e) => updateExpression(e.target.value)}
                   onClick={preventDefaults} onBlur={(e) => onBlur(e.target.value)}/>
        <Button  icon="pi pi-ellipsis-h" disabled={syntaxError} onClick={(event) => {
          setVisible(true);
          preventDefaults(event);
        }} style={{
          backgroundColor: props.backgroundColor,
          borderColor: props.color,
          color: props.color,
        }}/>
      </div>
      <Dialog visible={visible} onHide={() => setVisible(false)} draggable={false} resizable={false}
              breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}
              footer={footer} header={header} onClick={preventDefaults} dismissableMask={true} onMaskClick={(e) =>
        preventDefaults(e.nativeEvent)
      }>
        <div className="dialog-menu">
          <Dropdown value={selectedVariable} onChange={(e) => setSelectedVariable(e.value)}
                    options={variables} optionLabel="label" className={"grow"}
                    placeholder="Use a variable" />
          <Button  label="Add" icon="pi pi-plus" disabled={syntaxError} onClick={addVariable} outlined />
        </div>
        <InputTextarea value={expressionString} className={`text-area ${syntaxError ? "error" : ""}`} ref={textAreaRef}
                       onChange={(e) => {
                         updateExpression(e.target.value);
                       }} rows={5} cols={30} />
      </Dialog>
    </>
  );
};

export { Expression };

import { Language, Statement } from "../model/meta-language.model";
import { Statement as StatementComponent } from "./Statement";
import { AbstractStatement as AbstractStatementModel, Command } from "../model/language.model";
import "./CmdStatement.css";
import { Button } from "primereact/button";
import { Expression } from "./Expression";
import { checkPosition } from "../util/checkPosition";

const defaultStatementLanguage: Statement = {
  name: "unknown",
  component: "cmd",
  label: "unknown",
  icon: "pi-bolt",
  color: "white",
  backgroundColor: "#F08080",
  extensions: {
    params: {
      type: "array",
      defs: "string"
    }
  }
};

const CmdStatement = (props: {
  statement: Command,
  language: Language,
  blockLength: number,
  position: number,
  parent: AbstractStatementModel,
  level: number,
  isOpen?: boolean,
  onUp: CallableFunction,
  onDown: CallableFunction,
  onRemove: CallableFunction,
  onStatementChanged: CallableFunction
  onOpen?: CallableFunction
}) => {
  const statementFromLanguage = props.language.statements[props.statement.name];
  const params = statementFromLanguage?.extensions?.params;
  const correctPosition = checkPosition(props.position, props.blockLength, props.language, props.statement, props.parent, props.level);
  const updating = false;
  const statementParams = props.statement.params;

  const backgroundColor = (correctPosition) ?
    (updating ? "#00AA00" : (statementFromLanguage?.backgroundColor ?? defaultStatementLanguage.backgroundColor ?? "")) :
    props.language.err.backgroundColor;

  const up = () => props.onUp();

  const down = () => props.onDown();

  const removeStatement = () => props.onRemove();

  const removeParam = (index: number) => {
    const newStatementParameters = [...statementParams];
    newStatementParameters.splice(index, 1);
    props.onStatementChanged({
      ...props.statement,
      params: newStatementParameters
    });
  };

  const editStatementParam = (value: string, index: number) => {
    const newStatementParameters = [...statementParams];
    newStatementParameters[index] = value;
    props.onStatementChanged({
      ...props.statement,
      params: newStatementParameters
    });
  };

  const add = () => {
    const newStatementParameters = [...statementParams, " "];
    props.onStatementChanged({
      ...props.statement,
      params: newStatementParameters
    });
  };

  return (
    <StatementComponent
      title={statementFromLanguage?.label ?? props.statement.name}
      icon={correctPosition ? (statementFromLanguage.icon ?? defaultStatementLanguage.icon ?? "") : props.language.err.icon}
      color={correctPosition ? (statementFromLanguage.color ?? defaultStatementLanguage.color ?? "") : props.language.err.color}
      backgroundColor={backgroundColor}
      error={(correctPosition) ? "" : "Wrong position!"}
      isOpen={props.isOpen}
      onUp={up}
      onDown={down}
      onRemove={removeStatement}
      onOpen={props?.onOpen}
      header={
        <span>({
          statementParams.map((parameter, index) => <span
            key={index}>{(index ? ", " : "") + parameter}</span>)
        })</span>
      }
      body={
        params && params?.type === "array" ?
          <>
            {
              statementParams.map((parameter, index) =>
                <div key={index} className="input-group">
                  <Expression
                    language={props.language} expressionValue={parameter}
                    blockType={props.statement.name}
                    onExpressionValueChanged={(value: string) => editStatementParam(value, index)}
                    color={(statementFromLanguage.color ?? defaultStatementLanguage.color ?? "")}
                    backgroundColor={backgroundColor}/>
                  <Button
                    className="accordion-button" icon="pi pi-times" onClick={() => removeParam(index)}
                    style={{
                      margin: "1px",
                      backgroundColor: `${(statementFromLanguage.backgroundColor ?? defaultStatementLanguage.backgroundColor)}44`,
                      borderColor: (statementFromLanguage.color ?? defaultStatementLanguage.color),
                      color: (statementFromLanguage.color ?? defaultStatementLanguage.color)
                    }}
                  />
                </div>)
            }

            <div className="input-group">
              <Button  className="accordion-button" icon="pi pi-plus" onClick={add}
                      style={{
                        backgroundColor: (statementFromLanguage.backgroundColor ?? defaultStatementLanguage.backgroundColor),
                        borderColor: (statementFromLanguage.color ?? defaultStatementLanguage.color),
                        color: (statementFromLanguage.color ?? defaultStatementLanguage.color)
                      }}
              />
            </div>
          </> :
          params && params?.type === "structure" ?
            <>
              {
                (params.defs as { name: string }[]).map((fieldDef, index) =>
                  <div key={fieldDef.name} className="input-group">
                    <span>{fieldDef.name}</span>
                    <Expression
                      language={props.language} expressionValue={statementParams[index]}
                      blockType={props.statement.name}
                      onExpressionValueChanged={(value: string) => editStatementParam(value, index)}
                      color={(statementFromLanguage?.color ?? defaultStatementLanguage.color ?? "")}
                      backgroundColor={backgroundColor}/>
                  </div>)
              }
            </> :
            <></>
      }
    />
  );
};

export { CmdStatement, defaultStatementLanguage };

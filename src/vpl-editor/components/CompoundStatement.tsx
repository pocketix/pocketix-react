import { Language, Statement } from "../model/meta-language.model";
import { Statement as StatementComponent } from "./Statement";
import {
  AbstractStatement as AbstractStatementModel,
  Block as BlockModel,
  CompoundStatement as CompoundStatementModel
} from "../model/language.model";
import "./CompoundStatement.css";
import { Expression } from "./Expression";
import { Block } from "./Block";
import { useState } from "react";
import { checkPosition } from "../util/checkPosition";

const defaultStatementLanguage: Statement = {
  name: "if",
  component: "compound",
  label: "if",
  icon: "pi-question-circle",
  color: "white",
  backgroundColor: "#F08080",
  extensions: {
    enableCondition: true
  }
};

const CompoundStatement = (props: {
  statement: CompoundStatementModel,
  language: Language,
  blockLength: number,
  position: number,
  parent: AbstractStatementModel,
  level: number,
  isOpen?: boolean;
  onUp: CallableFunction,
  onDown: CallableFunction,
  onRemove: CallableFunction,
  onStatementChanged: CallableFunction,
  onOpen?: CallableFunction
}) => {
  const [statement, setStatement] = useState(props.statement);
  const statementFromLanguage = props.language.statements[props.statement.name];
  const correctPosition = checkPosition(props.position, props.blockLength, props.language, props.statement, props.parent, props.level);
  const updating = false;
  const backgroundColor = (correctPosition) ?
    (updating ? "#00AA00" : (statementFromLanguage?.backgroundColor ?? defaultStatementLanguage.backgroundColor ?? "")) :
    props.language.err.backgroundColor;

  function expressionValueChanged(condition: string) {
    const newStatement = {
      ...statement,
      condition
    };

    setStatement(newStatement);
    props.onStatementChanged(newStatement);
  }

  const up = () => props.onUp();

  const down = () => props.onDown();

  const remove = () => props.onRemove();

  const blockUpdate = (block: BlockModel) => {
    const newStatement = {
      ...statement,
      block
    };

    setStatement(newStatement);
    props.onStatementChanged(newStatement);
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
      onRemove={remove}
      onOpen={props?.onOpen}
      header={
        statementFromLanguage.extensions?.enableCondition ?
          <div className="condition">
            <Expression language={props.language} expressionValue={props.statement.condition}
                        onExpressionValueChanged={expressionValueChanged} color={(statementFromLanguage.color ?? defaultStatementLanguage.color ?? "")}
                        backgroundColor={backgroundColor} />
          </div> :
          <></>
      }
      body={
        <Block block={props.statement.block} language={props.language} parent={props.statement as any}
               level={props.level + 1} onUpdate={blockUpdate} />
      }
    />
  );
};

export { CompoundStatement, defaultStatementLanguage };

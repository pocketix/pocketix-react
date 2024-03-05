import {Language, Statement} from "../model/meta-language.model";
import {Statement as StatementComponent} from "./Statement"
import {AbstractStatement as AbstractStatementModel, Block as BlockModel, CompoundStatement as CompoundStatementModel} from "../model/language.model";
import "./CompoundStatement.css"
import {Expression} from "./Expression";
import {checkPosition} from "./AbstractStatement";
import {Block} from "./Block";
import {useState} from "react";

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
    onUp: CallableFunction,
    onDown: CallableFunction,
    onRemove: CallableFunction,
    onStatementChanged: CallableFunction
}) => {
    const [statement, setStatement] = useState(props.statement);
    const statementFromLanguage = props.language.statements[props.statement.name];
    const correctPosition = checkPosition(props.position, props.blockLength, props.language, props.statement, props.parent, props.level);
    let updating = false;
    const backgroundColor = (correctPosition) ?
        (updating ? '#00AA00' : (statementFromLanguage?.backgroundColor ?? defaultStatementLanguage.backgroundColor ?? "")) :
        props.language.err.backgroundColor

    function expressionValueChanged(index: number) {
        return undefined;
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
            onUp={up}
            onDown={down}
            onRemove={remove}
            header={
                statementFromLanguage.extensions?.enableCondition ? <div className="condition"><Expression language={props.language} expressionValue={props.statement.condition} onExpressionValueChanged={expressionValueChanged}/></div> : <></>
            }
            body={
                <Block block={props.statement.block} language={props.language} parent={props.statement as any} level={props.level + 1} onUpdate={blockUpdate}/>
            }
        />
    );
}

export {CompoundStatement, defaultStatementLanguage};

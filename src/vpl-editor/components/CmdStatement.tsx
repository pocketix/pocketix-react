import {Language, Statement} from "../model/meta-language.model";
import {Statement as StatementComponent} from "./Statement"
import {AbstractStatement as AbstractStatementModel, Command} from "../model/language.model";
import "./CmdStatement.css"
import {Button} from "primereact/button";
import {Expression} from "./Expression";
import {checkPosition} from "./AbstractStatement";
import {useState} from "react";

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
    onUp: CallableFunction,
    onDown: CallableFunction,
    onRemove: CallableFunction,
    onStatementChanged: CallableFunction
}) => {
    const statementFromLanguage = props.language.statements[props.statement.name];
    const params = statementFromLanguage?.extensions?.params;
    const correctPosition = checkPosition(props.position, props.blockLength, props.language, props.statement, props.parent, props.level);
    let updating = false;

    const [statementParams, setStatementParams] = useState(props.statement.params);


    const backgroundColor = (correctPosition) ?
        (updating ? '#00AA00' : (statementFromLanguage?.backgroundColor ?? defaultStatementLanguage.backgroundColor ?? "")) :
        props.language.err.backgroundColor

    const up = () => props.onUp();

    const down = () => props.onDown();

    const remove = (index: number) => {
        const newStatementParameters = [...statementParams];
        newStatementParameters.splice(index, 1);
        setStatementParams(newStatementParameters);
        props.onRemove();
    };

    const editStatementParam = (value: string, index: number) => {
        const newStatementParameters = [...statementParams];
        newStatementParameters[index] = value;
        setStatementParams(newStatementParameters);
        props.onStatementChanged(statementParams);
    }

    const add = () => {
        setStatementParams([...statementParams, " "]);
        props.onStatementChanged(statementParams);
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
                <span>({
                    statementParams.map((parameter, index) => <span key={JSON.stringify(parameter)}>{(index ? ', ' : '') + parameter}</span>)
                })</span>
            }
            body={
                params && params?.type === 'array' ?
                    <>
                        {
                            statementParams.map((parameter, index) =>
                                <div key={JSON.stringify(parameter)} className="input-group">
                                    <Expression
                                    language={props.language} expressionValue={parameter}
                                    onExpressionValueChanged={(value: string) => editStatementParam(value, index)}/>
                                    <Button
                                            className="accordion-button" icon="pi pi-times" onClick={() => remove(index)}
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
                            <Button className="accordion-button" icon="pi pi-plus" onClick={add}
                                    style={{
                                        backgroundColor: (statementFromLanguage.backgroundColor ?? defaultStatementLanguage.backgroundColor),
                                        borderColor: (statementFromLanguage.color ?? defaultStatementLanguage.color),
                                        color: (statementFromLanguage.color ?? defaultStatementLanguage.color)
                                    }}
                            />
                        </div>
                    </> :
                    <div className="input-group">
                        {
                            (statementFromLanguage?.extensions?.params?.defs as any).map((parameter: {
                                name: string | undefined;
                            }) => <input key={JSON.stringify(parameter)} value={parameter.name}/>)
                        }
                    </div>
            }
        />
    );
}

export {CmdStatement, defaultStatementLanguage};

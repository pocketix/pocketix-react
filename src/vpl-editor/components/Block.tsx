import {
  AbstractStatement,
  Block as LanguageBlock,
  Command,
  CompoundStatement as CompoundStatementModel
} from "../model/language.model";
import { Language, Statement as StatementModel } from "../model/meta-language.model";
import "./Block.css";
import { CmdStatement } from "./CmdStatement";
import { CompoundStatement } from "./CompoundStatement";
import { Statement } from "./Statement";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

const Block = (props: {
  block: LanguageBlock,
  language: Language,
  parent?: StatementModel,
  level: number,
  onUpdate: CallableFunction
}) => {
  const parent = props.parent ?? {
    name: "_"
  } as StatementModel;

  const [recommendedStatements, setRecommendedStatements] = useState([] as StatementModel[]);
  const [block, setBlock] = useState(props.block);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null as unknown as StatementModel);

  useEffect(() => {
    setBlock(props.block);
  }, [props.block]);

  const searchSuggestions = (query: string) => {
    const suggestions: StatementModel[] = [];

    Object.entries(props.language.statements).forEach(([key, val]) => {
      if ((!val.levels || val.levels.includes(props.level)) &&
        (!val.avoidLevels || !val.avoidLevels.includes(props.level)) &&
        (!val.parents || val.parents.includes(props.parent?.name as string)) &&
        (!val.avoidParents || !val.avoidParents.includes(props.parent?.name as string)) && key.startsWith(query)) {
        suggestions.push({
          ...val
        });
      }

      setRecommendedStatements(suggestions);
    });
  };

  const add = () => {
    if (!selectedItem) {
      return;
    }

    const newBlock = [...block, {
      name: selectedItem.name || "",
      condition: undefined,
      params: [],
      block: []
    }];
    setBlock(newBlock);

    props.onUpdate(newBlock);
  };

  const move = (index: number, direction: number) => {
    const newIndex = index + direction;

    const blockNextState = [...block];

    if ((index < 0 || newIndex < 0 || newIndex >= block.length || index >= block.length)) {
      return;
    }

    [blockNextState[index], blockNextState[newIndex]] = [blockNextState[newIndex], blockNextState[index]];

    setBlock(blockNextState);
    props.onUpdate(blockNextState);
  };

  const remove = (index: number) => {
    const blockNextState = [...block];
    blockNextState.splice(index, 1);
    setBlock(blockNextState);
    props.onUpdate(blockNextState);
  };

  const statementChanged = (statement: StatementModel, index: number) => {
    const blockNextState = [...block];
    blockNextState[index] = statement;
    setBlock(blockNextState);
    props.onUpdate(blockNextState);
  };

  function createTemplate(item: StatementModel) {
    return (
      <div className="recommendation-item">
        <i className={`pi ${item.icon}`}></i>
        <div>{item.label}</div>
      </div>
    );
  }

  return (
    <>
      <div className="block">
        {block.map((statement, index) => {
          const componentType: "cmd" | "compound" | undefined = props.language.statements[statement?.name]?.component;

          if (componentType === "cmd") {
            return <CmdStatement statement={statement as Command} language={props.language}
                                 blockLength={block.length} position={index}
                                 parent={parent as unknown as AbstractStatement} level={props.level}
                                 onUp={() => move(index, -1)}
                                 onDown={() => move(index, 1)}
                                 onRemove={() => remove(index)}
                                 onStatementChanged={(statement: StatementModel) => statementChanged(statement, index)}
                                 key={statement.id} />;
          }

          if (componentType === "compound") {
            return <CompoundStatement statement={statement as CompoundStatementModel}
                                      language={props.language}
                                      blockLength={block.length} position={index}
                                      parent={parent as unknown as AbstractStatement}
                                      level={props.level}
                                      onUp={() => move(index, -1)}
                                      onDown={() => move(index, 1)}
                                      onRemove={() => remove(index)}
                                      onStatementChanged={(statement: StatementModel) => statementChanged(statement, index)}
                                      key={statement.id} />;
          }

          return <Statement onUp={() => move(index, -1)}
                            onDown={() => move(index, 1)}
                            onRemove={() => remove(index)}
                            body={<></>} color={props.language.err.color} icon={props.language.err.icon}
                            backgroundColor={props.language.err.backgroundColor}
                            error={"Unknown statement!"} header={<></>} title={statement?.name}
                            key={statement.id} />;
        })}
        <Button icon="pi pi-plus" onClick={() => setDialogVisible(true)} style={{
          backgroundColor: props.language.statements[parent.name].backgroundColor,
          borderColor: props.language.statements[parent.name].color,
          color: props.language.statements[parent.name].color
        }} />
      </div>
      <Dialog onHide={() => {
        setDialogVisible(false);
      }} visible={dialogVisible} header={<span>Add statement</span>} footer={
        <>
          <Button icon="pi pi-check" disabled={!selectedItem} onClick={() => {
            setDialogVisible(false);
            add();
          }} label="Add" />
          <Button icon="pi pi-times" onClick={() => setDialogVisible(false)} label="Cancel" />
        </>
      }>
        <AutoComplete dropdown={true} completeMethod={(event) => searchSuggestions(event.query)} field="label"
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.value)}
                      suggestions={recommendedStatements}
                      itemTemplate={createTemplate}
        />
      </Dialog>
    </>
  );
};

export { Block };

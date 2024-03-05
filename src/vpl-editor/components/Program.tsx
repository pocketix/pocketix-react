import {ToggleButton} from "primereact/togglebutton";
import {Button} from "primereact/button";
import {Block} from "./Block";
import {Program as ProgramModel, Block as BlockModel} from "../model/language.model";
import {Language} from "../model/meta-language.model";
import {TextEditor} from "./TextEditor";
import "./Program.css";
import {useState} from "react";

const Program = (props: {
    program: ProgramModel,
    language: Language,
    level: number,
    onProgramChange: CallableFunction
}) => {
    const [program, setProgram] = useState(props.program);

    return (
        <>
            <div className="menu">
                <div className="menu-left">
                    <ToggleButton className="toggle-desktop" onIcon="pi pi-palette" offIcon="pi pi-palette"/>
                    <ToggleButton className="toggle-mobile" onIcon="pi pi-palette" offIcon="pi pi-palette"/>
                    <Button icon="pi pi-save"></Button>
                </div>

                <div className="menu-center">

                </div>

                <div className="menu-right">

                </div>
            </div>

            <div className="program">
                <div className="visual-editor">
                    <Block block={program.block} language={props.language} level={0} onUpdate={(block: BlockModel) => {
                        console.log(block);
                        setProgram({
                            ...program,
                            block
                        })
                    }}/>
                </div>
                <div className="text-editor mobile-open">
                    <TextEditor key={JSON.stringify(program)} program={program} onProgramChange={(newProgram: ProgramModel) => setProgram(newProgram)}/>
                </div>
            </div>
        </>
    )
}

export {Program};

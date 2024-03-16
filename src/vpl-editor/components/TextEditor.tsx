import {Program} from "../model/language.model";
import { useEffect, useState } from "react";
import {InputTextarea} from "primereact/inputtextarea";
import "./TextEditor.css"

const TextEditor = (props: { program: Program, onProgramChange: CallableFunction }) => {
  const convertProgramToEditorContent = (program: Program) => JSON.stringify(program.block, null, 2);

	const [editorContent, setEditorContent] = useState(convertProgramToEditorContent(props.program));
	const [syntaxError, setSyntaxError] = useState(false);
	const [timer, setTimer] = useState(undefined as NodeJS.Timeout | undefined);

  useEffect(() => {
    setEditorContent(convertProgramToEditorContent(props.program))
  }, [props.program]);

	const timerHandler = (blockAsString: string) => {
		try {
			const block = JSON.parse(blockAsString);
			setSyntaxError(false);

			setEditorContent(blockAsString);
			props.onProgramChange({
				...props.program,
				block
			});
		} catch (e) {
			setSyntaxError(true);
		}
		finally {
			setTimer(undefined)
		}
	}

	const onProgramChange = (change: string) => {
		setEditorContent(change);

		if (timer)
			clearTimeout(timer);

		setTimer(setTimeout(() => timerHandler(change), 1000));
	}

	return (
		<InputTextarea className={`text-area ${syntaxError ? "error" : ""}`}
			value={editorContent}
			onChange={(e) => onProgramChange(e.target.value)}
		/>
	)

}

export {TextEditor};

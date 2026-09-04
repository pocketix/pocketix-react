import {Program} from "../model/language.model";
import { useEffect, useRef, useState } from "react";
import {InputTextarea} from "primereact/inputtextarea";
import "./TextEditor.css"
import { captureAnalyticsEvent } from "../util/analytics";

const TextEditor = (props: { program: Program, onProgramChange: CallableFunction }) => {
  const convertProgramToEditorContent = (program: Program) => JSON.stringify(program.block, null, 2);

	const [editorContent, setEditorContent] = useState(convertProgramToEditorContent(props.program));
	const [syntaxError, setSyntaxError] = useState(false);
	const [timer, setTimer] = useState(undefined as NodeJS.Timeout | undefined);
	const [changed, setChanged] = useState(false);
	// True while a keystroke's debounce hasn't committed yet - guards the
	// resync effect below from clobbering in-progress typed-but-uncommitted
	// text with an unrelated incoming props.program change (e.g. a visual
	// editor edit landing while the user is still mid-typing).
	const hasPendingEdit = useRef(false);

  useEffect(() => {
    if (hasPendingEdit.current) {
      return;
    }

    setEditorContent(convertProgramToEditorContent(props.program))
  }, [props.program]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

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
			setTimer(undefined);
			hasPendingEdit.current = false;
		}
	}

	const onProgramChange = (change: string) => {
		setEditorContent(change);
		setChanged(true);
		hasPendingEdit.current = true;

		if (timer)
			clearTimeout(timer);

		setTimer(setTimeout(() => timerHandler(change), 1000));
	}

	const onTextOutputChange = () => {
		if (changed) {
			captureAnalyticsEvent('edited_program_in_text_editor', {
				timestamp: new Date().toISOString(),
				vpl_version: 'vpl_old'
			});

			setChanged(false);
		}
	}

	return (
		<InputTextarea className={`text-area ${syntaxError ? "error" : ""}`}
			value={editorContent}
			onChange={(e) => onProgramChange(e.target.value)}
			onBlur={onTextOutputChange}
		/>
	)

}

export {TextEditor};

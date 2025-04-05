import React, { useRef, useState } from "react";
import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { More } from "./More";
import "primeicons/primeicons.css";
import { OpenAPI, ProgramService } from "../generated";
import { defaultProgram } from "../util/defaultProgram";
import { defaultMetaLanguage } from "../util/defaultMetaLanguage";
import { Program as ProgramModel } from "pocketix-react/dist/types/model/language.model";
import { Statement, Variable } from "pocketix-react/dist/types/model/meta-language.model";
import { Button } from "primereact/button";
import {
  readableToSerializedCapabilityAndVariablesReplacer,
  serializedToReadableCapabilityAndVariablesReplacer
} from "../util/capabilityAndVariablesReplacers";
import { Toast } from "primereact/toast";
import {PocketixEditor} from "pocketix-react";

const getCurrentBaseUrl = () => {
  const fullUrl = window.location.href as string;

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const url = new URL(fullUrl);

  if (process.env.REACT_BACKEND_URL) {
      return process.env.REACT_BACKEND_URL;
  }

  return (url.port !== "80" && url.port !== "443") ? `${url.protocol}//${url.hostname}:3000` : `${url.protocol}//${url.hostname}:3000`;
};

OpenAPI.BASE = `${getCurrentBaseUrl()}/api`;

function App() {
  const [program, setProgram] = useState(defaultProgram);
  const [metaLanguage, setMetaLanguage] = useState(defaultMetaLanguage);
  const [capabilities, setCapabilities] = useState([] as (Statement & {
    capabilityId: string
  })[]);
  const [variables, setVariables] = useState([] as Variable[]);
  const [evaluateButtonEnabled, setEvaluateButtonEnabled] = useState(false);
  const toast = useRef<Toast>(null);

  const replaceProgramWithSerializedCapabilitiesAndParameters = (program: ProgramModel) =>
    readableToSerializedCapabilityAndVariablesReplacer(program, capabilities, variables);

  const onProgramTrigger = (program: ProgramModel) => {
    const evaluableProgram = replaceProgramWithSerializedCapabilitiesAndParameters(program);

    ProgramService.v1RunProgram(evaluableProgram)
      .then((value) => {
        const commands = serializedToReadableCapabilityAndVariablesReplacer(value, capabilities, variables);

        if (!toast || !toast.current) {
          return;
        }

        toast.current.show(commands.map(
          (command: { name: string, params: string }) => ({
            severity: "info",
            summary: "Triggered capabilities",
            detail: `Triggered capability ${command.name} with parameters ${JSON.stringify(command.params)}`
          })
        ));
      })
      .catch((error) => console.log(error));
  };

  return (
    <PrimeReactProvider>
      <Toast ref={toast} position="bottom-center"/>
      <div className="heading-content">
        <h1>
          Pocketix
        </h1>
        <More onProgramChange={setProgram} onMetaLanguageChange={setMetaLanguage} onCapabilitiesChange={setCapabilities}
              onVariablesChange={setVariables} />
      </div>
      <PocketixEditor language={metaLanguage}
                      program={program}
                      level={0}
                      onProgramChange={(changedProgram: ProgramModel) => {
                 setProgram(changedProgram);
                 setEvaluateButtonEnabled(true);
               }}
                      key={JSON.stringify(program)}
                      menu={<><Button icon="pi pi-bolt" onClick={() => onProgramTrigger(program)} disabled={!evaluateButtonEnabled}/></>} />
    </PrimeReactProvider>
  );
}

export default App;

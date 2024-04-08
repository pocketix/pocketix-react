import React, {useRef, useState} from "react";
import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { More } from "./More";
import "primeicons/primeicons.css";
import { Program } from "../vpl-editor/components/Program";
import { OpenAPI, ProgramService } from "../generated";
import { defaultProgram } from "../util/defaultProgram";
import { defaultMetaLanguage } from "../util/defaultMetaLanguage";
import { Program as ProgramModel } from "../vpl-editor/model/language.model";
import { Language, Statement, Variable } from "../vpl-editor/model/meta-language.model";
import { Button } from "primereact/button";
import {
  readableToSerializedCapabilityAndVariablesReplacer,
  serializedToReadableCapabilityAndVariablesReplacer
} from "../util/capabilityAndVariablesReplacers";
import {Toast} from "primereact/toast";

const getCurrentBaseUrl = () => {
  const fullUrl = window.location.href as string;

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const url = new URL(fullUrl);

  return `${url.protocol}//${url.hostname}`;
};

OpenAPI.BASE = `${getCurrentBaseUrl()}:5000`;

function App() {
  const [program, setProgram] = useState(defaultProgram);
  const [metaLanguage, setMetaLanguage] = useState(defaultMetaLanguage);
  const [capabilities, setCapabilities] = useState([] as (Statement & {
    capabilityId: string
  })[]);
  const [variables, setVariables] = useState([] as Variable[]);
  const toast = useRef<Toast>(null);


  const replaceProgramWithSerializedCapabilitiesAndParameters = (program: ProgramModel) =>
      readableToSerializedCapabilityAndVariablesReplacer(program, capabilities, variables);

  const onProgramTrigger = (program: ProgramModel) => {
    const evaluableProgram = replaceProgramWithSerializedCapabilitiesAndParameters(program);

    ProgramService.v1RunProgram(evaluableProgram)
      .then((value) =>
          console.log(serializedToReadableCapabilityAndVariablesReplacer(value, capabilities, variables)))
      .catch((error) => console.log(error));
  }

  return (
    <PrimeReactProvider>
      <Toast ref={toast} />
      <div className="heading-content">
        <h1>
          IoT-Automiser
        </h1>
        <More onProgramChange={setProgram} onMetaLanguageChange={setMetaLanguage} onCapabilitiesChange={setCapabilities}
              onVariablesChange={setVariables} />
      </div>
      <Program language={metaLanguage}
               program={program}
               level={0}
               onProgramChange={setProgram}
               key={JSON.stringify(program)}
               menu={<><Button icon="pi pi-bolt" onClick={() => onProgramTrigger(program)} /></>} />
    </PrimeReactProvider>
  );
}

export default App;

import React, { useState } from "react";
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

  const replaceProgramWithSerializedCapabilitiesAndParameters = (program: ProgramModel) => {
    let programAsString = JSON.stringify(program);

    capabilities.forEach(item => programAsString = programAsString.replaceAll(item.name, item.capabilityId));
    variables.forEach(item => programAsString = programAsString.replaceAll(item.label, item.id));

    return JSON.parse(programAsString);
  };

  const onProgramTrigger = (program: ProgramModel) => {
    const evaluableProgram = replaceProgramWithSerializedCapabilitiesAndParameters(program);

    ProgramService.v1RunProgram(evaluableProgram)
      .then((value) => console.log(value))
      .catch((error) => console.log(error));
  }

  return (
    <PrimeReactProvider>
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

import "./More.css";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { createVariablesFromDevice } from "../util/createVariablesFromDevice";
import {
  createCapabilitiesFromDeviceAndCapabilityTemplate
} from "../util/createCapabilitiesFromDeviceAndCapabilityTemplate";
import { Group, GroupService, Program, ProgramService, Version } from "../generated";
import { Language, Statement, Variable } from "pocketix-react/dist/types/model/meta-language.model";
import {serializedToReadableCapabilityAndVariablesReplacer} from "../util/capabilityAndVariablesReplacers";
import {preventDefaults} from "../util/preventDefaults";

const More = (props: {
  onProgramChange: CallableFunction,
  onMetaLanguageChange: CallableFunction,
  onCapabilitiesChange: CallableFunction,
  onVariablesChange: CallableFunction
}) => {
  const [visible, setVisible] = useState(false);

  const showDialog = (e: React.MouseEvent) => {
    preventDefaults(e);
    setVisible(true);
  };

  const hideDialog = (e: React.MouseEvent) => {
    preventDefaults(e);
    setVisible(false);
  };

  const [selectedGroup, setSelectedGroup] = useState(undefined as undefined | Group);
  const [groups, setGroups] = useState([] as Group[]);
  const [groupsError, setGroupsError] = useState("");

  const [groupById, setGroupById] = useState(null as null | Group);
  const [groupsByIdError, setGroupsByIdError] = useState("");

  const [programs, setPrograms] = useState([] as Program[]);
  const [capabilities, setCapabilities] = useState([] as (Statement & {
    capabilityId: string
  })[]);
  const [variables, setVariables] = useState([] as Variable[]);

  const [activeProgramIndex, setActiveProgramIndex] = useState(undefined as number | undefined);

  const [metaLanguage, setMetaLanguage] = useState(undefined as Language | undefined);
  const [currentMetaLanguageVersion, setCurrentMetaLanguageVersion] = useState(undefined as Version | undefined);

  const replaceProgramWithReadableCapabilitiesAndParameters = (program: Program) =>
    serializedToReadableCapabilityAndVariablesReplacer(program.data, capabilities, variables);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsFromApi = await GroupService.getAllGroups(false);
        setGroups(groupsFromApi);
      } catch (error) {
        setGroupsError((error as Error).message);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      return;
    }

    const fetchGroup = async () => {
      try {
        const groupFromApi = await GroupService.getGroup((selectedGroup as Group).id, false) as Group;
        setGroupById(groupFromApi);

        const newVariables = groupFromApi.devices.flatMap(createVariablesFromDevice);
        const newCapabilities = groupFromApi.devices.flatMap(createCapabilitiesFromDeviceAndCapabilityTemplate);

        setVariables(newVariables);
        setCapabilities(newCapabilities);

        props.onVariablesChange(newVariables);
        props.onCapabilitiesChange(newCapabilities);

        setActiveProgram(0);
      } catch (error) {
        setGroupsByIdError((error as Error).message);
      }
    };

    fetchGroup();
  }, [selectedGroup]);

  useEffect(() => {
    if (!selectedGroup) {
      return;
    }

    const fetchPrograms = async () => {
      try {
        let programsFromApi = await ProgramService.getProgramOfGroup((selectedGroup as Group).id) as Program[];

        programsFromApi = programsFromApi.map(item => ({...item, data: replaceProgramWithReadableCapabilitiesAndParameters(item)}));

        setActiveProgramIndex(0);
        setPrograms(programsFromApi);
      } catch (error) {
        setGroupsByIdError((error as Error).message);
      }
    };

    fetchPrograms();
  }, [groupById]);

  useEffect(() => {
    if (activeProgramIndex === undefined) {
      return;
    }

    const newVersion = programs[activeProgramIndex]?.version;

    if (newVersion === currentMetaLanguageVersion) {
      return;
    }

    const fetchMetaLanguage = async () => {
      try {
        const metaLanguage = await ProgramService.getMetaLanguage(newVersion);
        setMetaLanguage(metaLanguage);
      } catch (error) {
        setGroupsByIdError((error as Error).message);
      }
    };

    fetchMetaLanguage();
  }, [activeProgramIndex]);

  const setActiveProgram = (index: number) => {
    const newVersion = programs[index].version;
    setActiveProgramIndex(index);

    if (newVersion === currentMetaLanguageVersion) {
      return;
    }

    setCurrentMetaLanguageVersion(newVersion);

    ProgramService.getMetaLanguage(newVersion).then((metaLanguage) => setMetaLanguage(metaLanguage as Language));
  };

  const updateProgramAndMetaLanguage = () => {
    if (activeProgramIndex === undefined || metaLanguage === undefined) {
      return;
    }

    const newMetaLanguage = { ...metaLanguage };

    newMetaLanguage.variables = variables;
    capabilities.forEach(capability => newMetaLanguage.statements[capability.name] = capability);

    props.onMetaLanguageChange(newMetaLanguage);
    props.onProgramChange(programs[activeProgramIndex].data);
  };

  return (
    <>
      <Button icon="pi pi-angle-double-left" onClick={showDialog} />

      <Dialog
        visible={visible}
        modal={true}
        onHide={() => setVisible(false)}
        position="right"
        showHeader={false}
        className="fullscreen-modal"
      >
        <div className="heading-content">
          <h1>About Pocketix</h1>
          <Button icon="pi pi-angle-double-right" onClick={hideDialog} />
        </div>

        <Accordion activeIndex={0}>
          <AccordionTab header="Settings">
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-clone"></i>
                </span>
              <Dropdown value={selectedGroup} onChange={(e) => setSelectedGroup(e.value)} options={groups}
                        optionLabel="name"
                        placeholder="Select a Group" className="w-full md:w-14rem" />
            </div>
            <p className="m-0">
              Available devices:
            </p>
            <div>
              <ul className="m-0">
                {groupById?.devices?.map(item => <li key={item.deviceUid} className="device-parameters">
                  <span><i className={item.image}></i> {item.type.name} - {item.deviceName}</span>

                  <div>
                    <span>
                      Parameters
                    </span>
                    <ul>
                      {item.parameterValues?.map(parameterValue =>
                        <li
                          key={parameterValue.id}>{`${parameterValue.type.name}: ${parameterValue.type.type} [${parameterValue.type.units}]`}</li>)}
                    </ul>
                  </div>

                  <div>
                    <span>
                    Capabilities
                    </span>
                    <ul>
                      {item.capabilities?.length === 0 ? <li>No Capabilities</li> : <></>}
                      {item.capabilities?.map(capability => <li key={capability.id}>{capability.name}
                        ({capability.parameters.map(capabilityParameter =>
                          <span
                            key={`${capability.id}.${capabilityParameter.type}`}><i>{capabilityParameter.type}</i>: <i>{capabilityParameter.value}</i>
                          </span>)})</li>)}
                    </ul>
                  </div>

                </li>)}
              </ul>

              <div>
                <span>
                  Selecting this group will expand the meta language by the following variables:
                </span>
                <pre>
                  {JSON.stringify(variables, null, 2)}
                </pre>

                <span>
                  Selecting this group will expand the meta language by the following capabilities:
                </span>
                <pre>
                  {JSON.stringify(capabilities, null, 2)}
                </pre>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                  Available programs:
                  </span>
                  <span className="p-buttonset">
                    {programs.length ? <Button label="Use Selected Program" size="small" icon="pi pi-save"
                                               onClick={updateProgramAndMetaLanguage} /> : <></>}
                    {programs.map((item, index) => <Button key={item.id} label={item.name} size="small"
                                                           onClick={() => setActiveProgram(index)}
                                                           disabled={activeProgramIndex === index} />)}
                  </span>
                  <pre style={{ textWrap: "pretty" }}>
                    {programs[activeProgramIndex || 0] ? JSON.stringify(programs[activeProgramIndex || 0].data, null, 2) : "No programs"}
                  </pre>
                  <span>
                    Meta-Language Version: {currentMetaLanguageVersion}
                  </span>
                  <pre>
                    {JSON.stringify(metaLanguage, null, 2)}
                  </pre>
                </div>

              </div>
            </div>
          </AccordionTab>
          <AccordionTab header="Buttons overview">
            <p className="m-0">
              <i className="pi pi-palette"></i> - Switch visual editor on or off. On mobile exclusive with code editor.
            </p>

            <p className="m-0">
              <i className="pi pi-save"></i> - Manually save the code. If manual saving is selected changes are not
              automatically synchronized between visual editor and text editor. This button performs the manual
              synchronization. Each editor has it's own button, the left is used to copy the visual representation to
              text. The right save button saves the text representation to the visual editor.
            </p>

            <p className="m-0">
              <i className="pi pi-undo"></i> - Undo current changes to a previous version.
            </p>

            <p className="m-0">
              <i className="pi pi-refresh"></i> - Redo undone changes.
            </p>

            <p className="m-0">
              <i className="pi pi-cog"></i> - Language settings.
            </p>

            <p className="m-0">
              <i className="pi pi-sync"></i> - Switch automatic synchronization of both editors on or off. If the
              synchronisation is turned off manual saving need to be performed using the save buttons.
            </p>

            <p className="m-0">
              <i className="pi pi-code"></i> - Turn off text editor. Behaves similarly to the visual editor toggle.
            </p>

            <p className="m-0">
              <i className="pi pi-plus"></i> - Add statement (block) or parameter as a child of the current block.
            </p>

            <p className="m-0">
              <i className="pi pi-angle-up"></i> - Move expression upwards. Works only on items on the same level.
            </p>

            <p className="m-0">
              <i className="pi pi-angle-down"></i> - Move expression downwards. Works only on items on the same level.
            </p>

            <p className="m-0">
              <i className="pi pi-times"></i> - Remove statement or parameter.
            </p>

            <p className="m-0">
              <i className="pi pi-ellipsis-h"></i> - Open an expression editor.
            </p>

            <p className="m-0">
              <i className="pi pi-bolt"></i> - Execute the program on the backend.
            </p>

            <p className="m-0">
              <i className="pi pi-upload"></i> - Persist changes (unavailable in the demo).
            </p>
          </AccordionTab>
          <AccordionTab header="About">
              <p className="m-0">
                  Pocketix is a block and form based visual programming language and editor currently being developed
                  by <a href="https://www.fit.vut.cz/person/ijohn/.en">Petr John</a> (<a
                  href="mailto:ijohn@fit.vut.cz">ijohn@fit.vut.cz</a>) and <a
                  href="https://www.fit.vut.cz/person/hynek/.en">Jiří Hynek
                  </a> (<a href="mailto:hynek@fit.vut.cz">hynek@fit.vut.cz</a>) at <a href="https://www.fit.vut.cz/.en">BUT
                  FIT</a> primarily aimed at the automation of smart devices on mobile phones. The first prototype of the
                  tool was developed in cooperation between BUT FIT and the company <a
                  href="https://www.logimic.com/cs/">Logimic</a> in the project <a
                  href="https://www.fit.vut.cz/research/project/1692/.en">Services for Water Management and Monitoring
                  Systems in Retention Basins</a>. See more information on both <a
                  href="https://dexter.fit.vutbr.cz/">Dexter@FIT HomePage</a> and <a
                  href="https://github.com/pocketix">Pocketix Organisation</a>
              </p>
          </AccordionTab>
        </Accordion>

      </Dialog>
    </>
  );
};

export { More };

import "./More.css";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { preventDefaults } from "../vpl-editor/util/preventDefaults";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";

const More = () => {
  const [visible, setVisible] = useState(false);

  const showDialog = (e: React.MouseEvent) => {
    preventDefaults(e);
    setVisible(true);
  };

  const hideDialog = (e: React.MouseEvent) => {
    preventDefaults(e);
    setVisible(false);
  };
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" }
  ];
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
          <h1>More</h1>
          <Button icon="pi pi-angle-double-right" onClick={hideDialog} />
        </div>

        <Accordion activeIndex={0}>
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
          <AccordionTab header="Settings">
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-clone"></i>
                </span>
              <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities}
                        optionLabel="name"
                        placeholder="Select a City" className="w-full md:w-14rem" />
            </div>
            <p className="m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
          </AccordionTab>
          <AccordionTab header="About">
            <p className="m-0">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas
              sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt.
              Consectetur, adipisci velit, sed quia non numquam eius modi.
            </p>
          </AccordionTab>
        </Accordion>

      </Dialog>
    </>
  );
};

export { More };

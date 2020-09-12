import YAML from "yaml";
import FileSaver from "file-saver";

import { message } from "antd";

import db from "../../data/database";

async function exportProgramToFile(id) {
  /*
    1. Create file blob from YAML object
    2. Push to browser (prompt file save dialog)
  */

  const [yamlProgram, dbProgram] = await getProgramAsYaml(id);

  const yamlFile = new Blob([yamlProgram], { type: "text/yaml;charset=utf-8" });

  FileSaver.saveAs(yamlFile, `${dbProgram.name}.yaml`);
}

async function copyProgramToClipboard(id) {
  //! clipboard API not supported by IE
  /*
    1. Push YAML to browser clipboard object 
  */

  const [yamlProgram] = await getProgramAsYaml(id);

  navigator.clipboard
    .writeText(yamlProgram)
    .then(() => {
      message.success("Program copied to clipboard!");
    })
    .catch(() => {
      message.error("Could not copy program to clipboard, try another browser?");
    });
}

// Helper func
async function getProgramAsYaml(id) {
  // Retrieve program and return as YAML object
  const dbProgram = await db.read(id);
  return [YAML.stringify(dbProgram), dbProgram];
}

export { exportProgramToFile, copyProgramToClipboard };
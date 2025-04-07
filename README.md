# **pocketix-react**
A block- and form-based visual programming editor for smart home automation built for React [Try it out](https://pocketix-react.iot.petr-john.cz/)!

## **Overview**
**pocketix-react** is part of the broader **Pocketix** project — a visual programming language (VPL) designed for automating IoT and smart home devices. It enables users to design automation flows through drag-and-drop blocks and configurable forms, making it approachable for non-programmers.

Originally developed in collaboration with [Logimic](https://www.logimic.com/cs/) for the project *Services for Water Management and Monitoring Systems in Retention Basins*, the editor continues under development by [Petr John](https://www.fit.vut.cz/person/ijohn/.en) and [Jiří Hynek](https://www.fit.vut.cz/person/hynek/.en) at [BUT FIT](https://www.fit.vut.cz/.en).

More details available via:  
- 🔗 [Dexter@FIT Homepage](https://dexter.fit.vutbr.cz/)  
- 🔗 [Pocketix GitHub Organization](https://github.com/pocketix)

## **Features**
✅ Visual programming language editor for smart home automation  
✅ Block-based and form-based UI for designing automation workflows  
✅ Drag-and-drop interface with condition/action configuration  
✅ Smart device integration and extensible architecture    
✅ Supports the v1 language version

## **Installation**
To get started with `pocketix-react`, you’ll need [Node.js](https://nodejs.org/en/) (v20 or later) and [npm](https://www.npmjs.com/).

### Step 1: Clone the Repository

```bash
git clone https://github.com/pocketix/pocketix-react.git  
cd pocketix-react
```

### Step 2: Install Dependencies
```bash
npm run install:all
```
### Step 3: Start the Development Server
```bash
npm run start:demo
```
This will start a local dev server. Open your browser to view the application.

## **Usage**
The app provides a visual editor for creating and managing automation rules. Users can:

- Drag and connect visual blocks to define automation logic
- Use form-based configuration to set parameters and actions
- Integrate supported smart home devices into workflows
- Save, test, and iterate on automation flows without writing code

## **Related Projects**
- 🔗 [vpl-for-things](https://github.com/pocketix/vpl-for-things) — WIP version of new editor built in Lit compatible with Pocketix v2 language
- 🔗 [pocketixng](https://github.com/pocketix/pocketixng) — A code-oriented Angular editor for IoT automation using the Pocketix v1 scripting language
- 🔗 [Pocketix Node Interpreter](https://github.com/pocketix/pocketix-node) — Executes automation scripts created with Pocketix tools
- 🔗 [Pocketix Node Core](https://github.com/pocketix/pocketix-node-core) — A simple environment for basic IoT management

## **Contributing**
We welcome contributions! To get involved:

1) Fork the repo and create a new branch for your feature/fix
2) Follow our code style (checked via ESLint in `.eslintrc.json`)
3) Test your changes to ensure everything works smoothly
4) Submit a pull request with a clear summary of your work

## **License**
This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for full details.

## **Roadmap**
- 📦 Library distribution for embedding in other apps
- 🧪 Enhanced testing and usability improvements  

# Pocketix React

Pocketix is a block- and form-based visual programming language (VPL) editor aimed at automating smart home devices. It is currently being developed by [Petr John](https://www.fit.vut.cz/person/ijohn/.en) and [Jiří Hynek](https://www.fit.vut.cz/person/hynek/.en) at [BUT FIT](https://www.fit.vut.cz/.en), with the first prototype developed in collaboration with [Logimic](https://www.logimic.com/cs/) for the project *Services for Water Management and Monitoring Systems in Retention Basins*.

You can find more information about the project on the [Dexter@FIT HomePage](https://dexter.fit.vutbr.cz/) and the [Pocketix Organization on GitHub](https://github.com/pocketix).

## Features

- A visual programming language editor designed specifically for smart home automation.
- Block-based and form-based interfaces for intuitive creation of automation rules.
- Focus on integrating smart home devices and controlling them through visual programming.

## Installation

To get started with the `pocketix-react` project, you need to have [Node.js](https://nodejs.org/en/) (v20 or later) and [npm](https://www.npmjs.com/) installed.

### Step 1: Clone the Repository

```bash
git clone https://github.com/pocketix/pocketix-react.git
cd pocketix-react
```
# Step 2: Install Dependencies
Run the following command to install all necessary dependencies:

```
npm run install:all
Step 3: Start the Development Server
```
To run the local development/demo version of the project, use the following command:
```
npm run start:demo
```
This will start a local server, and you can view the project in your browser.

# Usage
The pocketix-react app provides a user interface for editing and creating smart home automation rules through a visual programming editor. Users can drag and drop blocks to design their automation workflows, making it accessible for users with minimal programming experience.

# Key Features
- Visual Programming Blocks: Users can connect blocks to define the flow of automation logic.

- Smart Home Device Integration: The editor allows for the inclusion of smart devices in the workflow.

- Form-Based Configuration: Blocks can be configured through forms to define actions, conditions, and parameters.

# Contributing
We welcome contributions! If you'd like to contribute to the project, please follow these guidelines:

1) Fork the repository and create a new branch for your feature or fix.

2) Ensure that your code adheres to the project's coding standards, which are checked by ESLint (configured in `.eslintrc.json`).

3) Test your changes thoroughly, and make sure the project runs as expected.

4) Create a pull request with a clear description of your changes and why they should be merged.

# License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

# Roadmap
- Integration examples: Later versions will include integration examples for various smart home platforms.

- Library distribution: The project will be made available as a library for use in other applications.

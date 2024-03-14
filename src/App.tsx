import React from "react";
import "./App.css";
import {Language, Variable} from "./vpl-editor/model/meta-language.model";
import {Expression} from "./vpl-editor/components/Expression";
import {PrimeReactProvider} from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {CmdStatement} from "./vpl-editor/components/CmdStatement";
import "primeicons/primeicons.css";
import {Program} from "./vpl-editor/components/Program";

const program = {
	"header": {},
	"block": [
		{
			"name": "fork",
			"block": [
				{
					"name": "if",
					"block": [
						{
							"name": "if",
							"block": [
								{
									"name": "PowerStrip.1",
									"params": [
										"false"
									]
								}
							],
							"condition": "Power Strip.socket_1=== 'true'"
						}
					],
					"condition": "(hours(now) > 5 && hours(now) < 12 || hours(now) > 13 && hours(now) < 23) && Water Level.lvl_measurement_percent_full > 50"
				},
				{
					"name": "else",
					"block": [
						{
							"name": "if",
							"block": [
								{
									"name": "PowerStrip.1",
									"params": [
										"true"
									]
								}
							],
							"condition": "Power Strip.socket_1 === 'false'"
						},
						{
							"name": "if",
							"block": [
								{
									"name": "PowerStrip.1",
									"params": [
										"false"
									]
								}
							],
							"condition": "Power Strip.socket_1 === 'true'"
						}
					],
					"condition": ""
				}
			],
			"condition": ""
		}
	]
};

const programLanguage = {
	"variables": [
		{
			"id": "1.socket_1",
			"label": "Power Strip.socket_1"
		},
		{
			"id": "1.socket_2",
			"label": "Power Strip.socket_2"
		},
		{
			"id": "1.socket_3",
			"label": "Power Strip.socket_3"
		},
		{
			"id": "1.socket_4",
			"label": "Power Strip.socket_4"
		},
		{
			"id": "1.usb_1",
			"label": "Power Strip.usb_1"
		},
		{
			"id": "17.battery_percentage",
			"label": "Water Level.battery_percentage"
		},
		{
			"id": "17.batteryVoltage",
			"label": "Water Level.batteryVoltage"
		},
		{
			"id": "17.distance",
			"label": "Water Level.distance"
		},
		{
			"id": "17.gps_source",
			"label": "Water Level.gps_source"
		},
		{
			"id": "17.lvl_depth_empty",
			"label": "Water Level.lvl_depth_empty"
		},
		{
			"id": "17.lvl_measurement_percent_full",
			"label": "Water Level.lvl_measurement_percent_full"
		},
		{
			"id": "17.lvl_spec_measurement_range",
			"label": "Water Level.lvl_spec_measurement_range"
		},
		{
			"id": "17.signal",
			"label": "Water Level.signal"
		},
		{
			"id": "17.water_level_hist1",
			"label": "Water Level.water_level_hist1"
		},
		{
			"id": "17.water_level_hist2",
			"label": "Water Level.water_level_hist2"
		},
		{
			"id": "17.water_level_hist3\t",
			"label": "Water Level.water_level_hist3\t"
		}
	],
	"statements": {
		"_": {
      "name": "_",
			"component": "compound",
			"label": "_",
			"icon": "pi-code",
			"color": "black",
			"levels": [
				-1
			],
			"backgroundColor": "#FFFFFF"
		},
		"fork": {
      "name": "fork",
			"component": "compound",
			"label": "fork",
			"icon": "pi-sitemap",
			"color": "white",
			"backgroundColor": "#9F8C3E",
			"avoidParents": [
				"fork",
				"switch"
			],
			"extensions": {
				"enableCondition": false
			}
		},
		"if": {
      "name": "if",
			"component": "compound",
			"label": "if",
			"icon": "pi-question-circle",
			"color": "white",
			"backgroundColor": "#BFB27C",
			"avoidParents": [
				"switch"
			],
			"extensions": {
				"enableCondition": true
			}
		},
		"else": {
      "name": "else",
			"component": "compound",
			"label": "else",
			"icon": "pi-question-circle",
			"color": "white",
			"backgroundColor": "#BFB27C",
			"parents": [
				"fork"
			],
			"avoidParents": [
				"switch"
			],
			"positions": [
				"last"
			],
			"avoidPositions": [
				"first"
			],
			"extensions": {
				"enableCondition": false
			}
		},
		"PowerStrip.1": {
      "name": "PowerStrip.1",
			"component": "cmd",
			"icon": "pi-bolt",
			"color": "white",
			"backgroundColor": "#99A8D7",
			"avoidParents": [
				"fork",
				"switch"
			],
			"extensions": {
				"params": {
					"type": "array"
				}
			},
			"label": "PowerStrip.toggle",
			"originalId": "1.1"
		}
	},
	"err": {
		"icon": "pi-exclamation-triangle",
		"color": "red",
		"backgroundColor": "#F9F63D"
	}
} as unknown as Language;


function App() {
	return (
		<PrimeReactProvider>
			<Program language={programLanguage} program={program} level={0} onProgramChange={() => {}}/>
		</PrimeReactProvider>
	);
}

export default App;

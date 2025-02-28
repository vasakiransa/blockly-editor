import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";
import {
  Container,
  Typography,
  Modal,
  Box,
  Button,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"; // Added FormControl, InputLabel, Select, MenuItem
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";

import InfoIcon from "@mui/icons-material/Info";
import Sidebar from './Sidebar';
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // ✅ Import Fixed
import LightbulbIcon from "@mui/icons-material/Lightbulb"; // ✅ Import Fixed

function App() {
  const [open, setOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [outputLog, setOutputLog] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleOpen = (content) => {
    setPopupContent(content);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    // Define custom blocks
    Blockly.Blocks["start_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Start");
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("The starting point of your program.");
        this.setHelpUrl("");
      },
    };
    // Logic Blocks
    Blockly.Blocks["logic_if"] = {
      init: function () {
        this.appendValueInput("IF").setCheck("Boolean").appendField("if");
        this.appendStatementInput("DO").appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("Executes a block of code if a condition is true.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["logic_equals"] = {
      init: function () {
        this.appendValueInput("A").appendField("=");
        this.appendValueInput("B");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Returns true if both inputs are equal.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["logic_and"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Boolean").appendField("and");
        this.appendValueInput("B").setCheck("Boolean");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Returns true if both inputs are true.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["logic_not"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Boolean").appendField("not");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Returns the opposite of the input.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["logic_boolean"] = {
      init: function () {
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["true", "TRUE"],
            ["false", "FALSE"],
          ]),
          "BOOL"
        );
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Returns either true or false.");
        this.setHelpUrl("");
      },
    };

    // Loop Blocks
    Blockly.Blocks["controls_repeat_ext"] = {
      init: function () {
        this.appendValueInput("TIMES").setCheck("Number").appendField("repeat");
        this.appendStatementInput("DO").appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("Repeats a specified number of times.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["controls_whileUntil"] = {
      init: function () {
        this.appendValueInput("BOOL").setCheck("Boolean").appendField("repeat while");
        this.appendStatementInput("DO").appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("Repeats while a condition is true.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["controls_for"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("count with")
          .appendField(new Blockly.FieldVariable("i"), "VAR")
          .appendField("from");
        this.appendValueInput("FROM").setCheck("Number");
        this.appendDummyInput().appendField("to");
        this.appendValueInput("TO").setCheck("Number");
        this.appendDummyInput().appendField("by");
        this.appendValueInput("BY").setCheck("Number");
        this.appendStatementInput("DO").appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("Count with a variable by a specified interval.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["controls_flow_statements"] = {
      init: function () {
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["break out of loop", "BREAK"],
            ["continue with next iteration of loop", "CONTINUE"],
          ]),
          "FLOW"
        );
        this.setPreviousStatement(true, null);
        this.setTooltip("Alters the flow of a loop.");
        this.setHelpUrl("");
        this.setColour(120);
      },
    };

    // Math Blocks
    Blockly.Blocks["math_number"] = {
      init: function () {
        this.appendDummyInput().appendField(new Blockly.FieldNumber(0), "NUM");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("A number.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["math_arithmetic"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Number");
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["+", "ADD"],
            ["-", "MINUS"],
            ["*", "MULTIPLY"],
            ["/", "DIVIDE"],
            ["^", "POWER"],
          ]),
          "OP"
        );
        this.appendValueInput("B").setCheck("Number");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("Performs arithmetic operations.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["math_modulo"] = {
      init: function () {
        this.appendValueInput("DIVIDEND").setCheck("Number").appendField("remainder of");
        this.appendValueInput("DIVISOR").setCheck("Number").appendField("÷ by");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("Returns the remainder of one number divided by another.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["math_random_int"] = {
      init: function () {
        this.appendDummyInput().appendField("random integer from");
        this.appendValueInput("FROM").setCheck("Number");
        this.appendDummyInput().appendField("to");
        this.appendValueInput("TO").setCheck("Number");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("Returns a random integer between the specified bounds.");
        this.setHelpUrl("");
      },
    };

    // Text Blocks
    Blockly.Blocks["text_length"] = {
      init: function () {
        this.appendValueInput("TEXT").setCheck("String").appendField("length of");
        this.setOutput(true, "Number");
        this.setColour(160);
        this.setTooltip("Returns the number of letters (including spaces) in the provided text.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["text_print"] = {
      init: function () {
        this.appendValueInput("TEXT").appendField("print");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Prints the specified text.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["text_create_join"] = {
      init: function () {
        this.appendDummyInput().appendField("create text with");
        this.appendValueInput("ADD0").setCheck("String").appendField("add");
        this.appendValueInput("ADD1").setCheck("String").appendField("add");
        this.setOutput(true, "String");
        this.setColour(160);
        this.setTooltip("Create a text string by joining together any number of items.");
        this.setHelpUrl("");
      },
      mutation: function (option) {
        var numberOfInputs = parseInt(option, 10);
        for (var i = 0; i < numberOfInputs; i++) {
          if (!this.getInput("ADD" + i)) {
            this.appendValueInput("ADD" + i).setCheck("String").appendField("add");
          }
        }
        for (var i = numberOfInputs; i < 2; i++) {
          if (this.getInput("ADD" + i)) {
            this.removeInput("ADD" + i);
          }
        }
      },
      domToMutation: function (xmlElement) {
        this.mutation(xmlElement.getAttribute("items"));
      },
      mutationToDom: function () {
        var container = document.createElement("mutation");
        container.setAttribute("items", 2);
        return container;
      },
    };

    Blockly.Blocks["text"] = {
      init: function () {
        this.appendDummyInput().appendField(new Blockly.FieldTextInput(""), "TEXT");
        this.setOutput(true, "String");
        this.setColour(160);
        this.setTooltip("A piece of text.");
        this.setHelpUrl("");
      },
    };

    // Delay Block
    Blockly.Blocks["delay_seconds"] = {
      init: function () {
        this.appendValueInput("SECONDS").setCheck("Number").appendField("wait for");
        this.appendDummyInput().appendField("seconds");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("Pauses execution for the specified number of seconds.");
        this.setHelpUrl("");
      },
    };

    // List Blocks
    Blockly.Blocks["lists_create_with"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Create list with")
          .appendField(
            new Blockly.FieldDropdown([
              ["1", "1"],
              ["2", "2"],
              ["3", "3"],
            ]),
            "ITEM_COUNT"
          ); // Dropdown for item count
        this.appendValueInput("ADD0").appendField("Item 1");
        this.appendValueInput("ADD1").appendField("Item 2");
        this.appendValueInput("ADD2").appendField("Item 3");
        this.setOutput(true, "Array");
        this.setColour(260);
        this.setTooltip("Create a list with the specified number of items.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["lists_repeat"] = {
      init: function () {
        this.appendValueInput("ITEM").appendField("create list with item");
        this.appendValueInput("NUM").setCheck("Number").appendField("repeated");
        this.appendDummyInput().appendField("times");
        this.setOutput(true, "Array");
        this.setColour(260);
        this.setTooltip("Creates a list with the same item repeated multiple times.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["lists_length"] = {
      init: function () {
        this.appendValueInput("VALUE").setCheck("Array").appendField("length of");
        this.setOutput(true, "Number");
        this.setColour(260);
      },
    };

    Blockly.Blocks["lists_isEmpty"] = {
      init: function () {
        this.appendValueInput("VALUE").setCheck("Array").appendField("is empty");
        this.setOutput(true, "Boolean");
        this.setColour(260);
        this.setTooltip("Returns true if the list is empty.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["lists_sort"] = {
      init: function () {
        this.appendValueInput("LIST").setCheck("Array").appendField("sort list");
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["numeric", "NUMERIC"],
            ["alphabetic", "ALPHABETIC"],
          ]),
          "TYPE"
        );
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["ascending", "1"],
            ["descending", "-1"],
          ]),
          "DIRECTION"
        );
        this.setOutput(true, "Array");
        this.setColour(260);
        this.setTooltip("Sorts a copy of the list.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["lists_pick_random"] = {
      init: function () {
        this.appendValueInput("LIST").setCheck("Array").appendField("pick random item from list");
        this.setOutput(true, null);
        this.setColour(260);
        this.setTooltip("Picks a random item from a list.");
        this.setHelpUrl("");
      },
    };

    // Variable Blocks - No custom block definition needed, using the built-in Variable category

    // Function Blocks -  No custom block definition needed, using the built-in Function category

    // JSON Blocks
    Blockly.Blocks["json_key"] = {
      init: function () {
        this.appendValueInput("KEY").setCheck("String").appendField("json key");
        this.appendValueInput("VALUE").appendField("value");
        this.setInputsInline(true);
        this.setOutput(true, "String");
        this.setColour(20);
        this.setTooltip("Creates a JSON key-value pair.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["json_parse"] = {
      init: function () {
        this.appendValueInput("JSON").setCheck("String").appendField("parse JSON object");
        this.setOutput(true, "Object");
        this.setColour(20);
        this.setTooltip("Parses a JSON string into an object.");
        this.setHelpUrl("");
      },
    };

    // Alert Block
    Blockly.Blocks["alert_notify"] = {
      init: function () {
        this.appendValueInput("HEADER").setCheck("String").appendField("Notify Header");
        this.appendValueInput("MESSAGE").setCheck("String").appendField("Message");
        this.appendDummyInput().appendField("Auto Close");
        this.appendDummyInput().appendField(new Blockly.FieldCheckbox("TRUE"), "AUTOCLOSE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(40);
        this.setTooltip("Displays an alert notification.");
        this.setHelpUrl("");
      },
    };

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          { kind: "category", name: "Start", colour: "#5C81A6", contents: [{ kind: "block", type: "start_block" }] },
          {
            kind: "category",
            name: "Logic",
            colour: "#5C81A6",
            contents: [
              { kind: "block", type: "logic_if" },
              { kind: "block", type: "logic_equals" },
              { kind: "block", type: "logic_and" },
              { kind: "block", type: "logic_not" },
              { kind: "block", type: "logic_boolean" },
            ],
          },
          {
            kind: "category",
            name: "Loops",
            colour: "#E67E22",
            contents: [
              { kind: "block", type: "controls_repeat_ext" },
              { kind: "block", type: "controls_whileUntil" },
              { kind: "block", type: "controls_for" },
              { kind: "block", type: "controls_flow_statements" },
            ],
          },
          {
            kind: "category",
            name: "Math",
            colour: "#5CA65C",
            contents: [
              { kind: "block", type: "math_number" },
              { kind: "block", type: "math_arithmetic" },
              { kind: "block", type: "math_modulo" },
              { kind: "block", type: "math_random_int" },
            ],
          },
          {
            kind: "category",
            name: "Text",
            colour: "#5C68A6",
            contents: [
              { kind: "block", type: "text" },
              { kind: "block", type: "text_length" },
              { kind: "block", type: "text_print" },
              { kind: "block", type: "text_create_join" },
            ],
          },
          {
            kind: "category",
            name: "Delay",
            colour: "#2980B9",
            contents: [{ kind: "block", type: "delay_seconds" }],
          },
          {
            kind: "category",
            name: "Lists",
            colour: "#745CA6",
            contents: [
              { kind: "block", type: "lists_create_with" },
              { kind: "block", type: "lists_repeat" },
              { kind: "block", type: "lists_length" },
              { kind: "block", type: "lists_isEmpty" },
              { kind: "block", type: "lists_sort" },
              { kind: "block", type: "lists_pick_random" },
            ],
          },
          {
            kind: "category",
            name: "Variables",
            custom: "VARIABLE",
            colour: "#A65C81",
          },
          {
            kind: "category",
            name: "Functions",
            custom: "PROCEDURE",
            colour: "#995CA6",
          },
          {
            kind: "category",
            name: "JSON",
            colour: "#F39C12",
            contents: [{ kind: "block", type: "json_key" }, { kind: "block", type: "json_parse" }],
          },
          {
            kind: "category",
            name: "Alert",
            colour: "#E74C3C",
            contents: [{ kind: "block", type: "alert_notify" }],
          },
        ],
      },
      grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
      trashcan: true,
    });

    workspaceRef.current = workspace;

    // Define JavaScript generators
    javascriptGenerator.forBlock["start_block"] = function (block) {
      return ""; // Start block doesn't generate any code
    };

    // Logic Code Generators
    javascriptGenerator.forBlock["logic_if"] = function (block) {
      var value_if = javascriptGenerator.valueToCode(block, "IF", javascriptGenerator.ORDER_ATOMIC);
      var statements_do = javascriptGenerator.statementToCode(block, "DO");
      return "if (" + value_if + ") {\n" + statements_do + "}\n";
    };

    javascriptGenerator.forBlock["logic_equals"] = function (block) {
      var value_a = javascriptGenerator.valueToCode(block, "A", javascriptGenerator.ORDER_ATOMIC);
      var value_b = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_ATOMIC);
      return value_a + " == " + value_b;
    };

    javascriptGenerator.forBlock["logic_and"] = function (block) {
      var value_a = javascriptGenerator.valueToCode(block, "A", javascriptGenerator.ORDER_ATOMIC);
      var value_b = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_ATOMIC);
      return value_a + " && " + value_b;
    };

    javascriptGenerator.forBlock["logic_not"] = function (block) {
      var value_a = javascriptGenerator.valueToCode(block, "A", javascriptGenerator.ORDER_ATOMIC);
      return "!" + value_a;
    };

    javascriptGenerator.forBlock["logic_boolean"] = function (block) {
      var dropdown_bool = block.getFieldValue("BOOL");
      return dropdown_bool === "TRUE" ? "true" : "false";
    };

    // Loop Code Generators
    javascriptGenerator.forBlock["controls_repeat_ext"] = function (block) {
      var times = javascriptGenerator.valueToCode(block, "TIMES", javascriptGenerator.ORDER_ATOMIC) || "0";
      var do_ = javascriptGenerator.statementToCode(block, "DO");
      return "for (let i = 0; i < " + times + "; i++) {\n" + do_ + "}\n";
    };

    javascriptGenerator.forBlock["controls_whileUntil"] = function (block) {
      var bool = javascriptGenerator.valueToCode(block, "BOOL", javascriptGenerator.ORDER_ATOMIC) || "false";
      var do_ = javascriptGenerator.statementToCode(block, "DO");
      return "while (" + bool + ") {\n" + do_ + "}\n";
    };

    javascriptGenerator.forBlock["controls_for"] = function (block) {
      var variable0 = javascriptGenerator.name(block.getFieldValue("VAR"), "VARIABLE");
      var from = javascriptGenerator.valueToCode(block, "FROM", javascriptGenerator.ORDER_ATOMIC) || "0";
      var to = javascriptGenerator.valueToCode(block, "TO", javascriptGenerator.ORDER_ATOMIC) || "0";
      var by = javascriptGenerator.valueToCode(block, "BY", javascriptGenerator.ORDER_ATOMIC) || "1";
      var do_ = javascriptGenerator.statementToCode(block, "DO");
      return "for (let " + variable0 + " = " + from + "; " + variable0 + " <= " + to + "; " + variable0 + " += " + by + ") {\n" + do_ + "}\n";
    };

    javascriptGenerator.forBlock["controls_flow_statements"] = function (block) {
      var flow = block.getFieldValue("FLOW");
      if (flow === "BREAK") {
        return "break;\n";
      } else {
        return "continue;\n";
      }
    };

    // Math Code Generators
    javascriptGenerator.forBlock["math_number"] = function (block) {
      var number_num = block.getFieldValue("NUM");
      return [number_num, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["math_arithmetic"] = function (block) {
      var value_a = javascriptGenerator.valueToCode(block, "A", javascriptGenerator.ORDER_ATOMIC);
      var dropdown_op = block.getFieldValue("OP");
      var value_b = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_ATOMIC);
      var operator = "";
      switch (dropdown_op) {
        case "ADD":
          operator = "+";
          break;
        case "MINUS":
          operator = "-";
          break;
        case "MULTIPLY":
          operator = "*";
          break;
        case "DIVIDE":
          operator = "/";
          break;
        case "POWER":
          operator = "**";
          break;
      }
      return [value_a + operator + value_b, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["math_modulo"] = function (block) {
      var value_dividend = javascriptGenerator.valueToCode(block, "DIVIDEND", javascriptGenerator.ORDER_ATOMIC);
      var value_divisor = javascriptGenerator.valueToCode(block, "DIVISOR", javascriptGenerator.ORDER_ATOMIC);
      return [value_dividend + " % " + value_divisor, javascriptGenerator.ORDER_MODULUS];
    };

    javascriptGenerator.forBlock["math_random_int"] = function (block) {
      var from = javascriptGenerator.valueToCode(block, "FROM", javascriptGenerator.ORDER_ATOMIC) || "0";
      var to = javascriptGenerator.valueToCode(block, "TO", javascriptGenerator.ORDER_ATOMIC) || "100";
      return ["Math.floor(Math.random() * (" + to + " - " + from + " + 1) + " + from + ")", javascriptGenerator.ORDER_FUNCTION_CALL];
    };

    // Text Code Generators
    javascriptGenerator.forBlock["text_length"] = function (block) {
      var value_text = javascriptGenerator.valueToCode(block, "TEXT", javascriptGenerator.ORDER_ATOMIC);
      return [value_text + ".length", javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["text_print"] = function (block) {
      var value_text = javascriptGenerator.valueToCode(block, "TEXT", javascriptGenerator.ORDER_ATOMIC);
      return "console.log(" + value_text + ");\n";
    };

    javascriptGenerator.forBlock["text_create_join"] = function (block) {
      let items = [];
      for (let i = 0; block.getInput("ADD" + i); i++) {
        items.push(javascriptGenerator.valueToCode(block, "ADD" + i, javascriptGenerator.ORDER_COMMA) || '""');
      }
      return ['' + items.join(' + ') + '', javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["text"] = function (block) {
      var text_text = block.getFieldValue("TEXT");
      return ['"' + text_text + '"', javascriptGenerator.ORDER_ATOMIC];
    };

    // Delay Code Generator
    javascriptGenerator.forBlock["delay_seconds"] = function (block) {
      var seconds = javascriptGenerator.valueToCode(block, "SECONDS", javascriptGenerator.ORDER_ATOMIC) || "0";
      return "await new Promise(resolve => setTimeout(resolve, " + seconds + " * 1000));\n";
    };

    // List Code Generators
    javascriptGenerator.forBlock["lists_create_with"] = function (block) {
      const itemCount = block.getFieldValue("ITEM_COUNT");
      const elements = [];
      for (let i = 0; i < parseInt(itemCount, 10); i++) {
        elements[i] = javascriptGenerator.valueToCode(block, "ADD" + i, javascriptGenerator.ORDER_COMMA) || "null";
      }
      return ["[" + elements.join(", ") + "]", javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["lists_repeat"] = function (block) {
      var item = javascriptGenerator.valueToCode(block, "ITEM", javascriptGenerator.ORDER_ATOMIC) || "null";
      var num = javascriptGenerator.valueToCode(block, "NUM", javascriptGenerator.ORDER_ATOMIC) || "0";
      return "Array(" + num + ").fill(" + item + ")";
    };

    javascriptGenerator.forBlock["lists_length"] = function (block) {
      const list = javascriptGenerator.valueToCode(block, "VALUE", javascriptGenerator.ORDER_MEMBER) || "[]";
      return [list + ".length", javascriptGenerator.ORDER_MEMBER];
    };

    javascriptGenerator.forBlock["lists_isEmpty"] = function (block) {
      const list = javascriptGenerator.valueToCode(block, "VALUE", javascriptGenerator.ORDER_MEMBER) || "[]";
      return ["!" + list + ".length", javascriptGenerator.ORDER_LOGICAL_NOT];
    };

    javascriptGenerator.forBlock["lists_sort"] = function (block) {
      const list = javascriptGenerator.valueToCode(block, "LIST", javascriptGenerator.ORDER_MEMBER) || "[]";
      const type = block.getFieldValue("TYPE");
      const direction = block.getFieldValue("DIRECTION");
      let sortFunction;
      if (type === "NUMERIC") {
        sortFunction = "(a, b) => " + direction + " * (a - b)";
      } else {
        sortFunction = "(a, b) => " + direction + " * a.localeCompare(b)";
      }
      return [list + ".slice().sort(" + sortFunction + ")", javascriptGenerator.ORDER_FUNCTION_CALL];
    };

    javascriptGenerator.forBlock["lists_pick_random"] = function (block) {
      const list = javascriptGenerator.valueToCode(block, "LIST", javascriptGenerator.ORDER_MEMBER) || "[]";
      return [list + "[Math.floor(Math.random() * " + list + ".length)]", javascriptGenerator.ORDER_MEMBER];
    };

    // JSON Code Generators
    javascriptGenerator.forBlock["json_key"] = function (block) {
      const key = javascriptGenerator.valueToCode(block, "KEY", javascriptGenerator.ORDER_ATOMIC) || '""';
      const value = javascriptGenerator.valueToCode(block, "VALUE", javascriptGenerator.ORDER_ATOMIC) || '""';
      return '{\n  "' + key.replace(/"/g, "") + '": ' + value + '\n}';
    };

    javascriptGenerator.forBlock["json_parse"] = function (block) {
      const jsonString = javascriptGenerator.valueToCode(block, "JSON", javascriptGenerator.ORDER_ATOMIC) || '""';
      return ["JSON.parse(" + jsonString + ")", javascriptGenerator.ORDER_FUNCTION_CALL];
    };

    // Alert Code Generator
    javascriptGenerator.forBlock["alert_notify"] = function (block) {
      const header = javascriptGenerator.valueToCode(block, "HEADER", javascriptGenerator.ORDER_ATOMIC) || '""';
      const message = javascriptGenerator.valueToCode(block, "MESSAGE", javascriptGenerator.ORDER_ATOMIC) || '""';
      const autoClose = block.getFieldValue("AUTOCLOSE") === "TRUE";

      return `alert("${header}: ${message}");\n`;
    };

    return () => workspace.dispose();
  }, []);

  const generateCode = () => {
    if (workspaceRef.current) {
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      setGeneratedCode(code);
    }
  };

  const runCode = () => {
    generateCode();
    try {
      // eslint-disable-next-line no-eval
      eval(generatedCode);
      setSnackbarOpen(true);
    } catch (error) {
      setOutputLog([...outputLog, `Error: ${error.message}`]);
      console.error(error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Blockly Visual Editor
      </Typography>
  
      <Box display="flex" justifyContent="center" my={2}>
        <Button variant="contained" color="primary" onClick={runCode} startIcon={<PlayArrowIcon />}>
          Run Code
        </Button>
      </Box>
  

      <Box display="flex" justifyContent="flex-end" my={2} mr={2} gap={2}>
      <Sidebar
                                
                            />
                            
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6">{popupContent}</Typography>
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>

      <div ref={blocklyDiv} style={{ height: "600px", width: "100%" }}></div>
  
      <Box mt={3} p={2} bgcolor="#f4f4f4" borderRadius={2}>
        {outputLog.map((log, index) => (
          <Typography key={index} variant="body1">
            {log}
          </Typography>
        ))}
      </Box>
  
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Code executed successfully!
        </Alert>
      </Snackbar>
    </>
  );
  
}

export default App;

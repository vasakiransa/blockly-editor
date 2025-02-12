import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";
import { Container, Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function App() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [outputLog, setOutputLog] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Define custom blocks
    Blockly.Blocks["start_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Start");
        this.setNextStatement(true, null);
        this.setColour(0);
      },
    };

    Blockly.Blocks["logic_and"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Boolean");
        this.appendValueInput("B").setCheck("Boolean").appendField("AND");
        this.setOutput(true, "Boolean");
        this.setColour(210);
      },
    };

    Blockly.Blocks["logic_equal"] = {
      init: function () {
        this.appendValueInput("A");
        this.appendValueInput("B").appendField("=");
        this.setOutput(true, "Boolean");
        this.setColour(210);
      },
    };

    Blockly.Blocks["logic_not"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Boolean").appendField("NOT");
        this.setOutput(true, "Boolean");
        this.setColour(210);
      },
    };

    Blockly.Blocks["math_sqrt"] = {
      init: function () {
        this.appendValueInput("NUM").setCheck("Number").appendField("Square Root");
        this.setOutput(true, "Number");
        this.setColour(230);
      },
    };

    Blockly.Blocks["math_remainder"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Number");
        this.appendValueInput("B").setCheck("Number").appendField("mod");
        this.setOutput(true, "Number");
        this.setColour(230);
      },
    };

    Blockly.Blocks["math_addition"] = {
      init: function () {
        this.appendValueInput("A").setCheck("Number");
        this.appendValueInput("B").setCheck("Number").appendField("+");
        this.setOutput(true, "Number");
        this.setColour(230);
      },
    };

    Blockly.Blocks["text_length"] = {
      init: function () {
        this.appendValueInput("TEXT").setCheck("String").appendField("Length of");
        this.setOutput(true, "Number");
        this.setColour(160);
      },
    };

    Blockly.Blocks["text_print"] = {
      init: function () {
        this.appendValueInput("TEXT").setCheck("String").appendField("Print");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };

    Blockly.Blocks["json_reader"] = {
      init: function () {
        this.appendValueInput("DICT").setCheck("Object").appendField("Read from JSON");
        this.appendValueInput("KEY").setCheck("String").appendField("Key");
        this.setOutput(true, null);
        this.setColour(200);
      },
    };

    Blockly.Blocks["json_set_value"] = {
      init: function () {
        this.appendValueInput("DICT").setCheck("Object").appendField("Set JSON Value");
        this.appendValueInput("KEY").setCheck("String").appendField("Key");
        this.appendValueInput("VALUE").appendField("Value");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
      },
    };

    Blockly.Blocks["repeat_time_loop"] = {
      init: function () {
        this.appendValueInput("TIMES").setCheck("Number").appendField("Repeat");
        this.appendStatementInput("DO").appendField("times");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };

    Blockly.Blocks["repeat_while_loop"] = {
      init: function () {
        this.appendValueInput("CONDITION").setCheck("Boolean").appendField("Repeat while");
        this.appendStatementInput("DO").appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };

    Blockly.Blocks["breakout_loop"] = {
      init: function () {
        this.appendDummyInput().appendField("Break out of loop");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };

    Blockly.Blocks["count_with"] = {
      init: function () {
        this.appendValueInput("FROM").setCheck("Number").appendField("Count from");
        this.appendValueInput("TO").setCheck("Number").appendField("to");
        this.appendStatementInput("DO").appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };

    Blockly.Blocks["alert_block"] = {
      init: function () {
        this.appendValueInput("MESSAGE").setCheck("String").appendField("Alert");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };

    Blockly.Blocks["variable_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Variable");
        this.appendValueInput("VALUE").setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
      },
    };

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          { kind: "category", name: "Start", contents: [{ kind: "block", type: "start_block" }] },
          { kind: "category", name: "Logic", contents: [{ kind: "block", type: "logic_and" }, { kind: "block", type: "logic_equal" }, { kind: "block", type: "logic_not" }] },
          { kind: "category", name: "Math", contents: [{ kind: "block", type: "math_sqrt" }, { kind: "block", type: "math_remainder" }, { kind: "block", type: "math_addition" }] },
          { kind: "category", name: "Text", contents: [{ kind: "block", type: "text_length" }, { kind: "block", type: "text_print" }] },
          { kind: "category", name: "JSON", contents: [{ kind: "block", type: "json_reader" }, { kind: "block", type: "json_set_value" }] },
          { kind: "category", name: "Loops", contents: [{ kind: "block", type: "repeat_time_loop" }, { kind: "block", type: "repeat_while_loop" }, { kind: "block", type: "breakout_loop" }, { kind: "block", type: "count_with" }] },
          { kind: "category", name: "Variables", contents: [{ kind: "block", type: "variable_block" }] },
          { kind: "category", name: "Alerts", contents: [{ kind: "block", type: "alert_block" }] },
        ],
      },
    });

    workspaceRef.current = workspace;
    // Define JavaScript generators for all necessary blocks
    javascriptGenerator.forBlock["repeat_while_loop"] = function (block) {
      const condition = javascriptGenerator.valueToCode(
        block,
        "CONDITION",
        javascriptGenerator.ORDER_ATOMIC
      ) || "false";
      const statements = javascriptGenerator.statementToCode(block, "DO");
      return `while (${condition}) {\n${statements}}\n`;
    };

    javascriptGenerator.forBlock["logic_and"] = function (block) {
      const A = javascriptGenerator.valueToCode(block, "A", javascriptGenerator.ORDER_ATOMIC) || "false";
      const B = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_ATOMIC) || "false";
      return [`(${A} && ${B})`, javascriptGenerator.ORDER_LOGICAL_AND];
    };

    javascriptGenerator.forBlock["logic_or"] = function (block) {
      const A = javascriptGenerator.valueToCode(block, "A", javascriptGenerator.ORDER_ATOMIC) || "false";
      const B = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_ATOMIC) || "false";
      return [`(${A} || ${B})`, javascriptGenerator.ORDER_LOGICAL_OR];
    };

    javascriptGenerator.forBlock["controls_if"] = function (block) {
      let code = "";
      let condition = javascriptGenerator.valueToCode(block, "IF0", javascriptGenerator.ORDER_NONE) || "false";
      let statements = javascriptGenerator.statementToCode(block, "DO0");
      code += `if (${condition}) {\n${statements}}\n`;

      for (let n = 1; n <= block.elseifCount_; n++) {
        condition = javascriptGenerator.valueToCode(block, `IF${n}`, javascriptGenerator.ORDER_NONE) || "false";
        statements = javascriptGenerator.statementToCode(block, `DO${n}`);
        code += `else if (${condition}) {\n${statements}}\n`;
      }

      if (block.elseCount_) {
        statements = javascriptGenerator.statementToCode(block, "ELSE");
        code += `else {\n${statements}}\n`;
      }

      return code;
    };

    javascriptGenerator.forBlock["controls_whileUntil"] = function (block) {
      const condition = javascriptGenerator.valueToCode(
        block,
        "BOOL",
        javascriptGenerator.ORDER_NONE
      ) || "false";
      const statements = javascriptGenerator.statementToCode(block, "DO");
      return `while (${condition}) {\n${statements}}\n`;
    };

    javascriptGenerator.forBlock["math_number"] = function (block) {
      return [block.getFieldValue("NUM"), javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["text"] = function (block) {
      return [`"${block.getFieldValue("TEXT")}"`, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock["variables_set"] = function (block) {
      const variable = block.getFieldValue("VAR");
      const value = javascriptGenerator.valueToCode(block, "VALUE", javascriptGenerator.ORDER_ASSIGNMENT) || "null";
      return `${variable} = ${value};\n`;
    };

    javascriptGenerator.forBlock["variables_get"] = function (block) {
      return [block.getFieldValue("VAR"), javascriptGenerator.ORDER_ATOMIC];
    };
    return () => workspace.dispose();
  }, []);

  const handleRun = async () => {
    if (!workspaceRef.current) return;
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(code);
    setOutputLog([]);

    try {
      const outputLog = [];
      const customFunctions = {
        outputLog: outputLog,
        print: (text) => outputLog.push(text),
        alert: (message) => outputLog.push(`Alert: ${message}`),
      };
      await new Function("outputLog", "print", "alert", `${code}\nreturn outputLog;`)(outputLog, customFunctions.print, customFunctions.alert);
      setOutputLog(outputLog);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error executing Blockly code:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Sheshgyan Code Editor</Typography>
      <Box ref={blocklyDiv} sx={{ height: "60vh", width: "100%" }} />
      <Button onClick={handleRun}>Run Code</Button>
      <Box>
        <Typography variant="h6">Generated Output:</Typography>
        {outputLog.length === 0 ? <Typography>No output</Typography> : outputLog.map((line, index) => <Typography key={index}>{line}</Typography>)}
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Code executed successfully!</Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
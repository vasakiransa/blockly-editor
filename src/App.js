import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";
import { Container, Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function App() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // 🟢 Define Custom Blocks (Alerts, JSON, Delays, Lists, Functions)
    Blockly.Blocks["alert_message"] = {
      init: function () {
        this.appendValueInput("TEXT")
          .setCheck("String")
          .appendField("Show Alert");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };

    javascriptGenerator.forBlock["alert_message"] = function (block) {
      const text = javascriptGenerator.valueToCode(block, "TEXT", javascriptGenerator.ORDER_ATOMIC) || '""';
      return `alert(${text});\n`;
    };

    Blockly.Blocks["delay_function"] = {
      init: function () {
        this.appendValueInput("TIME")
          .setCheck("Number")
          .appendField("Wait (ms)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };

    javascriptGenerator.forBlock["delay_function"] = function (block) {
      const time = javascriptGenerator.valueToCode(block, "TIME", javascriptGenerator.ORDER_ATOMIC) || "1000";
      return `await new Promise(resolve => setTimeout(resolve, ${time}));\n`;
    };

    Blockly.Blocks["json_parse"] = {
      init: function () {
        this.appendValueInput("STRING")
          .setCheck("String")
          .appendField("Parse JSON");
        this.setOutput(true, "Object");
        this.setColour(200);
      },
    };

    javascriptGenerator.forBlock["json_parse"] = function (block) {
      const jsonString = javascriptGenerator.valueToCode(block, "STRING", javascriptGenerator.ORDER_ATOMIC) || '""';
      return [`JSON.parse(${jsonString})`, javascriptGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks["list_length"] = {
      init: function () {
        this.appendValueInput("LIST")
          .setCheck("Array")
          .appendField("Get List Length");
        this.setOutput(true, "Number");
        this.setColour(230);
      },
    };

    javascriptGenerator.forBlock["list_length"] = function (block) {
      const list = javascriptGenerator.valueToCode(block, "LIST", javascriptGenerator.ORDER_ATOMIC) || "[]";
      return [`${list}.length`, javascriptGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks["function_call"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Call Function")
          .appendField(new Blockly.FieldTextInput("myFunction"), "FUNC_NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
      },
    };

    javascriptGenerator.forBlock["function_call"] = function (block) {
      const funcName = block.getFieldValue("FUNC_NAME");
      return `${funcName}();\n`;
    };

    // 🟠 Initialize Blockly Workspace
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          { kind: "category", name: "Logic", colour: "#5C81A6", contents: [{ kind: "block", type: "controls_if" }] },
          { kind: "category", name: "Loops", colour: "#A65C5C", contents: [{ kind: "block", type: "controls_repeat_ext" }] },
          { kind: "category", name: "Math", colour: "#5CA65C", contents: [{ kind: "block", type: "math_number" }] },
          { kind: "category", name: "Text", colour: "#A65CA6", contents: [{ kind: "block", type: "text" }] },
          { kind: "category", name: "Lists", colour: "#5CA6A6", contents: [{ kind: "block", type: "lists_create_with" }, { kind: "block", type: "list_length" }] },
          { kind: "category", name: "Variables", colour: "#A6A65C", contents: [{ kind: "block", type: "variables_get" }] },
          { kind: "category", name: "Functions", colour: "#FF5733", contents: [{ kind: "block", type: "procedures_defnoreturn" }, { kind: "block", type: "function_call" }] },
          {
            kind: "category",
            name: "Advanced",
            colour: "#FF5733",
            contents: [
              { kind: "block", type: "alert_message" },
              { kind: "block", type: "delay_function" },
              { kind: "block", type: "json_parse" },
            ],
          },
        ],
      },
    });

    workspaceRef.current = workspace;

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // 🟡 Generate & Run JavaScript Code
  const handleRun = async () => {
    if (!workspaceRef.current) return alert("Blockly workspace not initialized");

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(code);
    console.log("Generated Code:\n", code);

    try {
      await new Function(`return async () => { ${code} }`)()();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error executing Blockly code:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", padding: "20px", height: "100vh", backgroundColor: "#f0f0f0" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px", color: "#333" }}>
        Sheshgyan Code Editor 
      </Typography>

      {/* Blockly Workspace */}
      <Box ref={blocklyDiv} sx={{ height: "75vh", width: "100%", border: "2px solid #ccc", borderRadius: "10px", backgroundImage: "radial-gradient(#ddd 1px, transparent 1px)", backgroundSize: "15px 15px", backgroundColor: "#f8f9fa", marginBottom: "20px" }} />

      {/* Buttons Section */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        <Button variant="contained" startIcon={<PlayArrowIcon />} color="primary" onClick={handleRun}>
          Run Code
        </Button>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" sx={{ width: "100%" }}>Code executed successfully!</Alert>
      </Snackbar>
    </Container>
  );
}

export default App;

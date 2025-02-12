import React, { useEffect, useRef, useState } from 'react';
import 'blockly/blocks';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BlocklyEditor = () => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [executionOutput, setExecutionOutput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdowns, setDropdowns] = useState({ relay: false, intro: false, led: false });

  useEffect(() => {
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'iot_function',
        message0: 'Define function %1',
        args0: [{ type: 'field_input', name: 'FUNC_NAME', text: 'myFunction' }],
        message1: 'Do %1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        colour: 290,
        tooltip: 'Defines a function.',
      },
      {
        type: 'iot_call_function',
        message0: 'Call function %1',
        args0: [{ type: 'field_input', name: 'FUNC_NAME', text: 'myFunction' }],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: 'Calls a function.',
      },
      {
        type: 'iot_list',
        message0: 'Create list %1',
        args0: [{ type: 'field_input', name: 'LIST_NAME', text: 'myList' }],
        output: 'Array',
        colour: 230,
        tooltip: 'Creates a list.',
      },
    ]);
    
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: 'categoryToolbox',
        contents: [
          { kind: 'category', name: 'Logic', colour: '#5C81A6', contents: [{ kind: 'block', type: 'controls_if' }] },
          { kind: 'category', name: 'Loops', colour: '#FFAB19', contents: [{ kind: 'block', type: 'controls_repeat_ext' }] },
          { kind: 'category', name: 'Functions', colour: '#9A5BA5', contents: [
            { kind: 'block', type: 'iot_function' },
            { kind: 'block', type: 'iot_call_function' }
          ] },
          { kind: 'category', name: 'Lists', colour: '#66A05C', contents: [{ kind: 'block', type: 'iot_list' }] },
        ],
      },
    });
  }, []);

  const generateCode = () => {
    setGeneratedCode(javascriptGenerator.workspaceToCode(workspaceRef.current));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <header>
        <h1>IoT Blockly Editor</h1>
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search blocks..." />
      </header>
      <button onClick={generateCode}>Generate Code</button>
      <div ref={blocklyDiv} style={{ height: '500px', margin: '20px 0' }}></div>
      <pre>{generatedCode}</pre>
    </div>
  );
};

export default BlocklyEditor;

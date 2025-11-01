import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// --- Constants & Initial State ---
const INITIAL_ARRAY = [0x10, 0x20, 0x35, 0x42, 0x58, 0x66, 0x73, 0x89, 0x91, 0xA4];
const INITIAL_KEY_INPUT = '0x66';
const ARRAY_ADDR = 0x3000;

const getInitialState = () => ({
  array: INITIAL_ARRAY,
  keyInput: INITIAL_KEY_INPUT,
  keyToSearch: parseInt(INITIAL_KEY_INPUT, 16),
  registers: { A: 0, B: 0, C: 0, D: 0, E: 0 },
  hl: 0,
  low: null,
  high: null,
  mid: null,
  foundIndex: null,
  log: ['Simulation ready. Enter a key and press "Initialize".'],
  isInitialized: false,
  isFinished: false,
});

// --- Helper Functions ---
const hex = (num, padding = 2) => `0x${num.toString(16).toUpperCase().padStart(padding, '0')}`;

// --- Child Components for Better Structure ---

// Component for the auto-scrolling log
const LogPanel = ({ log }) => {
  const logEndRef = useRef(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="log-panel">
      <h2>Execution Log</h2>
      <div className="log-content">
        {log.map((msg, i) => <p key={i}>{msg}</p>)}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

// Component for the visual array display
const ArrayDisplay = ({ array, low, high, mid, foundIndex }) => (
  <div className="array-display">
    {array.map((value, index) => (
      <div key={index} className="array-cell-container">
        <div className="array-index">{index}</div>
        <div className={`array-cell
          ${index === mid ? 'mid' : ''}
          ${index === foundIndex ? 'found' : ''}
        `}>
          {hex(value)}
        </div>
        <div className="pointers">
          {index === low && <span className="pointer low">low</span>}
          {index === high && <span className="pointer high">high</span>}
        </div>
      </div>
    ))}
  </div>
);

// --- Main App Component ---
function App() {
  const [state, setState] = useState(getInitialState());

  const addLog = (message) => {
    setState(prevState => ({ ...prevState, log: [...prevState.log, message] }));
  };

  const handleInitialize = () => {
    const highIndex = state.array.length - 1;
    const key = parseInt(state.keyInput, state.keyInput.toLowerCase().startsWith('0x') ? 16 : 10) || 0;
    
    setState(prevState => ({
      ...prevState,
      keyToSearch: key,
      hl: ARRAY_ADDR,
      registers: { A: 0, B: 0, C: highIndex, D: 0, E: key },
      low: 0,
      high: highIndex,
      mid: null,
      foundIndex: null,
      isInitialized: true,
      isFinished: false,
      log: [
        '--- Simulation Initialized ---',
        `LXI H, ${hex(ARRAY_ADDR, 4)}   ; HL (base addr) = ${hex(ARRAY_ADDR, 4)}`,
        `MVI E, ${hex(key)}      ; E (key) = ${hex(key)}`,
        `MVI B, 00H        ; B (low) = 0`,
        `MVI C, ${hex(highIndex)}H        ; C (high) = ${highIndex}`,
      ]
    }));
  };

  const handleStep = () => {
    if (state.isFinished || !state.isInitialized) return;

    if (state.low > state.high) {
      addLog(`LOOP CHECK: low (${state.low}) > high (${state.high}). Key not found.`);
      addLog(`NOT_FOUND: MVI A, FFH`);
      setState(prevState => ({
        ...prevState,
        registers: { ...prevState.registers, A: 0xFF },
        foundIndex: -1,
        isFinished: true,
      }));
      return;
    }

    const mid = Math.floor((state.low + state.high) / 2);
    addLog(`--- New Loop Iteration ---`);
    addLog(`CALC MID: (low:${state.low} + high:${state.high}) / 2 = ${mid}`);
    addLog(`MOV D, ${hex(mid)}          ; D (mid) = ${hex(mid)}`);

    const arrayValue = state.array[mid];
    const addressOfMid = ARRAY_ADDR + mid;
    addLog(`GET M: HL = ${hex(ARRAY_ADDR, 4)} + ${mid} = ${hex(addressOfMid, 4)}`);
    addLog(`MOV A, M          ; A = ARRAY[mid] = ${hex(arrayValue)}`);

    addLog(`CMP E             ; Compare A (${hex(arrayValue)}) with E (${hex(state.keyToSearch)})`);
    
    if (arrayValue === state.keyToSearch) {
      addLog(`JZ FOUND          ; Values are equal. Key found at index ${mid}.`);
      setState(prevState => ({
        ...prevState,
        registers: { ...prevState.registers, A: mid, D: mid },
        hl: addressOfMid, mid, foundIndex: mid, isFinished: true
      }));
    } else if (arrayValue < state.keyToSearch) {
      const newLow = mid + 1;
      addLog(`JC IS_SMALLER     ; ${hex(arrayValue)} < ${hex(state.keyToSearch)}. Search upper half.`);
      addLog(`INR B             ; new low = mid + 1 = ${newLow}`);
      setState(prevState => ({
        ...prevState,
        registers: { ...prevState.registers, A: arrayValue, D: mid, B: newLow },
        hl: addressOfMid, mid, low: newLow
      }));
    } else {
      const newHigh = mid - 1;
      addLog(`IS_LARGER         ; ${hex(arrayValue)} > ${hex(state.keyToSearch)}. Search lower half.`);
      addLog(`DCR C             ; new high = mid - 1 = ${newHigh}`);
      setState(prevState => ({
        ...prevState,
        registers: { ...prevState.registers, A: arrayValue, D: mid, C: newHigh },
        hl: addressOfMid, mid, high: newHigh
      }));
    }
  };

  const handleReset = () => {
    setState(getInitialState());
  };

  const handleKeyInputChange = (e) => {
    setState({ ...getInitialState(), keyInput: e.target.value });
  };

  return (
    <div className="App">
      <header>
        <h1>8085 Binary Search Simulator</h1>
      </header>
      <div className="main-container">
        <div className="controls-panel panel">
          <h2>Controls</h2>
          <div className="input-group">
            <label htmlFor="key-input">Search Key (Hex or Dec):</label>
            <input id="key-input" type="text" value={state.keyInput} onChange={handleKeyInputChange} />
          </div>
          <button onClick={handleInitialize} disabled={state.isInitialized && !state.isFinished}>
            Initialize / Setup
          </button>
          <button onClick={handleStep} disabled={!state.isInitialized || state.isFinished}>
            Next Step
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>

        <div className="simulation-area panel">
          <h2>Memory Array</h2>
          <ArrayDisplay
            array={state.array}
            low={state.low}
            high={state.high}
            mid={state.mid}
            foundIndex={state.foundIndex}
          />
          {state.foundIndex !== null && (
            <div className="result-display">
              <strong>Result:</strong> {state.foundIndex === -1 ? `Key Not Found (FFH)` : `Key Found at Index ${state.foundIndex}`}
            </div>
          )}
        </div>

        <div className="side-panel">
          <div className="register-panel panel">
            <h2>8085 Registers</h2>
            <table>
              <tbody>
                <tr><td><strong>A</strong> (Accumulator)</td><td>{hex(state.registers.A)}</td></tr>
                <tr><td><strong>B</strong> (low)</td><td>{hex(state.registers.B)}</td></tr>
                <tr><td><strong>C</strong> (high)</td><td>{hex(state.registers.C)}</td></tr>
                <tr><td><strong>D</strong> (mid)</td><td>{hex(state.registers.D)}</td></tr>
                <tr><td><strong>E</strong> (Key)</td><td>{hex(state.registers.E)}</td></tr>
                <tr><td><strong>HL</strong> (Mem Pointer)</td><td>{hex(state.hl, 4)}</td></tr>
              </tbody>
            </table>
          </div>
          <LogPanel log={state.log} />
        </div>
      </div>
    </div>
  );
}

export default App;
# 8085 Binary Search Simulator

An interactive web-based simulator for visualizing and understanding binary search algorithm implementation on the Intel 8085 microprocessor.

## Overview

This simulator provides a step-by-step visualization of binary search algorithm execution, simulating the behavior of an Intel 8085 microprocessor. It demonstrates how binary search is implemented using 8085 assembly instructions, with real-time register updates and memory access visualization.

## Features

- **Interactive Step-by-Step Execution**: Execute binary search operations one step at a time
- **Visual Array Representation**: See the search array with highlighted indices (low, high, mid) and found elements
- **Register Monitoring**: Track all 8085 registers (A, B, C, D, E, HL) in real-time
- **Execution Log**: Detailed log of each instruction and operation performed
- **Customizable Search Key**: Enter any hexadecimal or decimal value to search
- **Visual Feedback**: Color-coded cells indicate current middle element, found element, and pointer positions

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-8085-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Running the Simulator

1. **Enter Search Key**: In the Controls panel, enter a value to search (supports both hex format like `0x66` or decimal format like `102`)

2. **Initialize**: Click "Initialize / Setup" to set up the simulation with the initial register values:
   - **HL**: Base address of the array (0x3000)
   - **E**: The search key
   - **B**: Low index (initially 0)
   - **C**: High index (initially array length - 1)

3. **Execute Steps**: Click "Next Step" repeatedly to execute each iteration of the binary search algorithm

4. **Monitor Progress**: 
   - Watch the array visualization for highlighted elements
   - Check the register panel for current register values
   - Read the execution log for detailed instruction traces

5. **View Results**: Once finished, the result will be displayed showing whether the key was found and at which index

6. **Reset**: Click "Reset" to start over with a fresh simulation

### Understanding the Visualization

- **Array Cells**: Display values in hexadecimal format
- **Yellow Highlight**: Indicates the current middle element being compared
- **Green Highlight**: Indicates the found element
- **Low Pointer** (blue): Shows the current low boundary
- **High Pointer** (red): Shows the current high boundary

## Algorithm Details

The simulator implements binary search on a sorted array:

1. Initialize low = 0, high = array.length - 1
2. While low <= high:
   - Calculate mid = (low + high) / 2
   - Compare array[mid] with the search key
   - If equal: element found, return index
   - If array[mid] < key: search upper half (low = mid + 1)
   - If array[mid] > key: search lower half (high = mid - 1)
3. If low > high: key not found

## Default Array

The simulator uses the following sorted array:
```
[0x10, 0x20, 0x35, 0x42, 0x58, 0x66, 0x73, 0x89, 0x91, 0xA4]
```

## 8085 Registers Used

- **A (Accumulator)**: Stores the current array element being compared
- **B**: Stores the low index
- **C**: Stores the high index
- **D**: Stores the mid index
- **E**: Stores the search key
- **HL**: Memory pointer to the current array element

## Project Structure

```
my-8085-simulator/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Main stylesheet
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

## Technologies Used

- **React**: Frontend framework
- **CSS3**: Styling and animations
- **JavaScript**: Logic implementation

## Educational Purpose

This simulator is designed for educational purposes to help students and enthusiasts understand:
- Binary search algorithm
- Intel 8085 microprocessor architecture
- Assembly language programming concepts
- Memory addressing and register operations

## License

This project is open source and available for educational use.

## Contributing

Contributions, issues, and feature requests are welcome!

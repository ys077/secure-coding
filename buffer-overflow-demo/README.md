# Buffer Overflow Vulnerability Demonstration

## Objective
This project is an educational web application built for the Secure Coding Lab practical. It visually demonstrates the concept of a buffer overflow vulnerability.

## Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js

## Project Structure
```text
buffer-overflow-demo/
├── server.js          # Express backend server and API
├── package.json       # Project configuration and dependencies
└── public/            # Static frontend files
    ├── index.html     # UI Structure
    ├── style.css      # Styling and states
    └── script.js      # Frontend logic and DOM manipulation
```

## Installation Instructions
1. Ensure you have Node.js installed.
2. Open a terminal in the `buffer-overflow-demo` directory.
3. Run the following command to install dependencies:
   ```bash
   npm install
   ```

## How to Run
Start the development server using:
```bash
npm start
```
Then, open your web browser and navigate to:
`http://localhost:3000`

## Demo Credentials
- **Username**: `admin`
- **Password**: `admin123`

## How the Buffer Overflow Simulation Works
The application uses a simulated 8-byte buffer. As you type into the input field:
- **Safe State (< 8 chars)**: The buffer holds the characters normally, displaying "SAFE".
- **Overflow State (> 8 chars)**: A JavaScript alert is triggered in real-time, indicating a "SEGMENTATION FAULT". The UI visually represents the memory blocks, showing how the characters spill out of the designated valid buffer area into the adjacent memory.

The frontend validates this in real-time, while a backend API (`POST /api/check-buffer`) provides secondary confirmation of the buffer length violation, completing the full-stack architecture.

## Actual C/GDB Demonstration vs Web Simulation
**Important:** This web application is purely a *visual simulation*. It does not execute real memory corruption, arbitrary memory access, or vulnerable C functions.

The actual vulnerability should be demonstrated using a C program (e.g., using `strcpy`) compiled without stack protections, and analyzed using GDB to observe the actual `SIGSEGV` segmentation fault when memory boundaries are overwritten. See the **Debugging Analysis** section within the app for a walkthrough of the GDB procedure.

# Project Database Comparison Tool

A web-based tool to compare two Excel databases and identify changes in projects between CGIAR Database (baseline) and RM Project Reports (latest version).

## Features

- 📊 Compare two Excel files side-by-side
- 🔍 Automatically detect changes in:
  - Total Amount Pledged
  - End Date
  - Status
- 🆕 Identify new projects not in the baseline
- ✅ Track unchanged projects
- 📈 Visual summary with statistics cards
- 🎨 Clean, modern interface

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/project-db-comparison.git
cd project-db-comparison
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Upload CGIAR Database**: Click on the first upload area and select your baseline Excel file
2. **Upload RM Project Reports**: Click on the second upload area and select your latest version Excel file
3. **Select ID Column**: Choose the column that uniquely identifies each project (e.g., Project ID, Code)
4. **Compare**: Click the "Compare Databases" button
5. **Review Results**: 
   - Orange cards show projects with changes
   - Blue cards show new projects
   - Green counter shows unchanged projects

## File Format

The tool accepts Excel files (.xlsx, .xls) with the following expected columns:
- Project ID (or similar unique identifier)
- Total Amount Pledged (or Amount, Total Amount, Pledged)
- End Date (or EndDate, Completion Date, End)
- Status (or Project Status, State)

## Technologies Used

- React
- Tailwind CSS
- SheetJS (xlsx) - Excel file processing
- Lucide React - Icons

## Project Structure

```
project-db-comparison/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
└── .gitignore
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Contact

For questions or support, please open an issue in the GitHub repository.
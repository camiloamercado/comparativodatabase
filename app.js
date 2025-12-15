import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [cgiarData, setCgiarData] = useState(null);
  const [rmData, setRmData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idColumn, setIdColumn] = useState('');

  const handleFileUpload = async (file, setData) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setData(jsonData);
  };

  const compareData = () => {
    if (!cgiarData || !rmData || !idColumn) return;
    
    setLoading(true);
    
    const cgiarMap = new Map(cgiarData.map(row => [String(row[idColumn]), row]));
    const results = {
      changes: [],
      newProjects: [],
      unchanged: []
    };

    rmData.forEach(rmRow => {
      const id = String(rmRow[idColumn]);
      const cgiarRow = cgiarMap.get(id);
      
      if (!cgiarRow) {
        results.newProjects.push(rmRow);
        return;
      }

      const changes = [];
      
      const amountFields = ['Total Amount Pledged', 'Amount', 'Total Amount', 'Pledged'];
      const rmAmount = amountFields.map(f => rmRow[f]).find(v => v !== undefined);
      const cgiarAmount = amountFields.map(f => cgiarRow[f]).find(v => v !== undefined);
      
      if (rmAmount !== cgiarAmount && (rmAmount || cgiarAmount)) {
        changes.push({
          field: 'Total Amount Pledged',
          oldValue: cgiarAmount,
          newValue: rmAmount
        });
      }

      const dateFields = ['End Date', 'EndDate', 'Completion Date', 'End'];
      const rmDate = dateFields.map(f => rmRow[f]).find(v => v !== undefined);
      const cgiarDate = dateFields.map(f => cgiarRow[f]).find(v => v !== undefined);
      
      if (rmDate !== cgiarDate && (rmDate || cgiarDate)) {
        changes.push({
          field: 'End Date',
          oldValue: cgiarDate,
          newValue: rmDate
        });
      }

      const statusFields = ['Status', 'Project Status', 'State'];
      const rmStatus = statusFields.map(f => rmRow[f]).find(v => v !== undefined);
      const cgiarStatus = statusFields.map(f => cgiarRow[f]).find(v => v !== undefined);
      
      if (rmStatus !== cgiarStatus && (rmStatus || cgiarStatus)) {
        changes.push({
          field: 'Status',
          oldValue: cgiarStatus,
          newValue: rmStatus
        });
      }

      if (changes.length > 0) {
        results.changes.push({
          id,
          projectData: rmRow,
          changes
        });
      } else {
        results.unchanged.push(rmRow);
      }
    });

    setComparison(results);
    setLoading(false);
  };

  const getColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Project Database Comparison</h1>
        <p className="text-gray-600 mb-8">Compare CGIAR Database with RM Project Reports</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">CGIAR Database (Base)</h2>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Excel file</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files[0], setCgiarData)}
              />
            </label>
            {cgiarData && (
              <div className="mt-4 flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{cgiarData.length} records loaded</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">RM Project Reports (Latest)</h2>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Excel file</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files[0], setRmData)}
              />
            </label>
            {rmData && (
              <div className="mt-4 flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{rmData.length} records loaded</span>
              </div>
            )}
          </div>
        </div>

        {cgiarData && rmData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Project ID Column
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={idColumn}
              onChange={(e) => setIdColumn(e.target.value)}
            >
              <option value="">-- Select ID column --</option>
              {getColumns(cgiarData).map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <button
              onClick={compareData}
              disabled={!idColumn}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Compare Databases
            </button>
          </div>
        )}

        {comparison && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Projects with Changes</p>
                    <p className="text-3xl font-bold text-orange-600">{comparison.changes.length}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-orange-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">New Projects</p>
                    <p className="text-3xl font-bold text-blue-600">{comparison.newProjects.length}</p>
                  </div>
                  <Info className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Unchanged Projects</p>
                    <p className="text-3xl font-bold text-green-600">{comparison.unchanged.length}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </div>
            </div>

            {comparison.changes.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-600">Projects with Changes</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comparison.changes.map((item, idx) => (
                    <div key={idx} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <p className="font-semibold text-gray-800 mb-2">Project ID: {item.id}</p>
                      {item.changes.map((change, cIdx) => (
                        <div key={cIdx} className="ml-4 mb-2">
                          <p className="text-sm font-medium text-gray-700">{change.field}:</p>
                          <p className="text-sm text-gray-600">
                            <span className="line-through text-red-600">{String(change.oldValue || 'N/A')}</span>
                            {' → '}
                            <span className="text-green-600 font-medium">{String(change.newValue || 'N/A')}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {comparison.newProjects.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">New Projects</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {comparison.newProjects.map((project, idx) => (
                    <div key={idx} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                      <p className="font-medium text-gray-800">
                        Project ID: {project[idColumn]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎉 ¡TERMINADO! 

**Estructura final de tu proyecto:**
```
project-db-comparison/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
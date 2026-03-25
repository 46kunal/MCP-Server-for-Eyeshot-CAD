import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Viewer from './components/ThreeViewer';
import StatusBar from './components/StatusBar';

const API_URL = 'http://localhost:8000/command';

function App() {
  const [activeTool, setActiveTool] = useState('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [modelState, setModelState] = useState({ shapeType: 'box', dimensions: { width: 1, height: 2, depth: 1 } });
  const [history, setHistory] = useState([]);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId);
    if (['box', 'sphere', 'cone', 'cylinder'].includes(toolId)) {
      handleSendCommand(`create a ${toolId}`);
    } else if (toolId === 'extrude') {
      handleSendCommand('extrude the shape by 2 units');
    } else if (toolId === 'measure') {
      handleSendCommand('what is the volume?');
    } else if (toolId === 'move') {
      setStatusMessage("Move tool selected. Use the command box to move (e.g., 'move right by 5')");
    } else if (toolId === 'select') {
      setStatusMessage("Select tool active.");
    }
  };

  const handleSendCommand = async (prompt) => {
    setIsProcessing(true);
    setStatusMessage(`Processing: "${prompt}"`);
    const entry = { prompt, timestamp: new Date().toLocaleTimeString(), status: 'pending' };
    setHistory(prev => [...prev, entry]);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setStatusMessage(data.message);
        setHistory(prev => {
          const u = [...prev];
          u[u.length - 1] = { ...u[u.length - 1], status: 'success', response: data.message };
          return u;
        });

        setModelState(prev => {
          let updated = { ...prev };
          
          if (data.data?.feature === 'shape_type') {
            updated.shapeType = data.data.new_value;
            updated.dimensions = Object.keys(data.data.dimensions || {}).length > 0
              ? data.data.dimensions : { width: 1, height: 1, depth: 1 };
          } else if (data.data?.feature && data.data?.new_value !== undefined) {
            updated.dimensions = {
              ...updated.dimensions,
              [data.data.feature]: data.data.new_value
            };
          }

          if (data.data?.volume !== undefined) updated.volume = `${data.data.volume} ${data.data.unit}`;
          if (data.color) updated.color = data.color;
          if (data.object_id) updated.objectId = data.object_id;

          return updated;
        });
      } else {
        throw new Error(data.detail || data.message || 'Unknown error');
      }
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
      setHistory(prev => {
        const u = [...prev];
        u[u.length - 1] = { ...u[u.length - 1], status: 'error', response: err.message };
        return u;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePropertyEdit = (key, value) => {
    handleSendCommand(`Set the ${key} to ${value}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar activeTool={activeTool} onToolSelect={handleToolSelect} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          modelState={modelState}
          onSendCommand={handleSendCommand}
          onPropertyEdit={handlePropertyEdit}
          isProcessing={isProcessing}
          history={history}
        />
        <Viewer modelState={modelState} setCoords={setCoords} />
      </div>

      <StatusBar coords={coords} isProcessing={isProcessing} statusMessage={statusMessage} />
    </div>
  );
}

export default App;

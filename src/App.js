import React, { useState } from 'react';
import NameInput from './components/NameInput';
import NamePool from './components/NamePool';
import HostControls from './components/HostControls';

const App = () => {
  const [names, setNames] = useState([]);
  const [assignedNames, setAssignedNames] = useState({});

  const addName = (name) => {
    setNames([...names, name]);
  };

  const shuffleNames = () => {
    let shuffled;
    let assignments;
    let isSelfAssigned;
  
    do {
      shuffled = names.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
  
      isSelfAssigned = false;
      assignments = {};
  
      for (let i = 0; i < names.length; i++) {
        if (names[i] === shuffled[i]) {
          isSelfAssigned = true;
          break;
        }
        assignments[names[i]] = shuffled[i];
      }
    } while (isSelfAssigned);
  
    setAssignedNames(assignments);
  };
  

  return (
    <div>
      <h1>Christmas Name Draw</h1>
      <NameInput addName={addName} />
      <NamePool names={names} />
      <HostControls names={names} shuffleNames={shuffleNames} />
      {Object.keys(assignedNames).length > 0 && (
        <div>
          <h2>Assigned Names</h2>
          <ul>
            {names.map((name, index) => (
              <li key={index}>{name} will give a gift to {assignedNames[name]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;

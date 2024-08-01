import React, { useState } from 'react';
import NameInput from './components/NameInput';
import NamePool from './components/NamePool';
import HostControls from './components/HostControls';
import "./App.scss";
import SnowBackground from './assets/SnowBackground';
import SoundPlayer from './assets/SoundPlayer';

const App = () => {
  const [names, setNames] = useState([]);
  const [assignedNames, setAssignedNames] = useState({});
  const [currentUser, setCurrentUser] = useState('');

  const addName = (name) => {
    setNames([...names, name]);
  };

  const shuffleNames = () => {
    if (names.length <= 1) {
      return;
    }

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
    <>
      <SnowBackground />
      <SoundPlayer />
      <div className='wrapper'>
        <h1>Karácsonyi sorsolás!</h1>
        <NameInput addName={addName} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        {names.length !== 0 && <NamePool names={names} />}
        {currentUser && (
          <>
            {currentUser.toLowerCase() === 'kata' && <HostControls shuffleNames={shuffleNames} />}
            {Object.keys(assignedNames).length > 0 && (
              <div>
                <h2>Kapott név</h2>
                <p>{currentUser}, te őt kaptad: {assignedNames[currentUser]}!</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;

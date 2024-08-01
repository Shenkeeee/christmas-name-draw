import React from 'react';

const HostControls = ({ shuffleNames, deleteAllAssignments }) => {
  return (
    <div>
      <h2>Host Beállítások</h2>
      <div className='centered'>
        <button className='shuffle-btn' onClick={shuffleNames}>Sorsolás!</button>
        <button className='reset-btn' onClick={deleteAllAssignments}>Reset!</button>
      </div>
    </div>
  );
};

export default HostControls;

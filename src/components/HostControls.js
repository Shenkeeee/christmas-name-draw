import React from 'react';

const HostControls = ({ shuffleNames }) => {
  return (
    <div>
      <h2>Host Beállítások</h2>
      <div className='centered'>
        <button className='shuffle-btn' onClick={shuffleNames}>Sorsolás!</button>
      </div>
    </div>
  );
};

export default HostControls;

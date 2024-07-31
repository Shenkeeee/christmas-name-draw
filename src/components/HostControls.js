import React from 'react';

const HostControls = ({ names, shuffleNames }) => {
  const handleShuffle = () => {
    shuffleNames();
  };

  return (
    <div>
      <h2>Host Controls</h2>
      <button onClick={handleShuffle}>Shuffle Names</button>
    </div>
  );
};

export default HostControls;

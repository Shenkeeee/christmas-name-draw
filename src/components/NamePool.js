import React from 'react';

const NamePool = ({ names }) => {
  return (
    <div>
      <h2>Name Pool</h2>
      <ul>
        {names.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NamePool;

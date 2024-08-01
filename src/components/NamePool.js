import React from 'react';

const NamePool = ({ names }) => {
  return (
    <div>
      <h2>Nevek a csomagban</h2>
      <ul>
        {names.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NamePool;

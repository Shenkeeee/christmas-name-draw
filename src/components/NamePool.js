import React from 'react';

const NamePool = ({ names, currentUser, deleteUser }) => {
  return (
    <div>
      <h2>Nevek a csomagban</h2>
      <ul>
        {names.map((name, index) => (
          <li key={index}>{name}
            {currentUser && currentUser.toLowerCase() === 'kata' && <button onClick={() => deleteUser(name)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NamePool;

import React, { useState } from 'react';

const NameInput = ({ addName, currentUser, setCurrentUser }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      addName(name);
      setCurrentUser(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!currentUser && (
        <div className='centered'>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ide írd a neved"
          />
          <button type="submit">Belépés!</button>
        </div>
      )}
    </form>
  );
};

export default NameInput;

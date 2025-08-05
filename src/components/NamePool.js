const { REACT_APP_ADMIN } = process.env;

const NamePool = ({ names, currentUser, deleteUser }) => {
  return (
    <div>
      <h2>Nevek a csomagban</h2>
      <ul>
        {names.map((name, index) => (
          <li key={index}>
            {name}
            {currentUser && currentUser.toLowerCase() === REACT_APP_ADMIN && (
              <button onClick={() => deleteUser(name)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NamePool;

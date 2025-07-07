import { useState } from 'react';
import './App.css';
import RequesterInterface from './components/RequesterInterface';
import ValidatorInterface from './components/ValidatorInterface';
import { users } from './utils/users';

function App() {
  const [currentUser, setCurrentUser] = useState(users[0]);

  const handleUserChange = (event) => {
    const selectedUserId = parseInt(event.target.value, 10);
    const selectedUser = users.find(user => user.id === selectedUserId);
    setCurrentUser(selectedUser);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Vacation Management System</h1>
        <div className="user-switcher">
          <label htmlFor="user-select">Current User: </label>
          <select id="user-select" onChange={handleUserChange} value={currentUser.id}>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <main className="main-content">
        {currentUser.role === 'Requester' ? (
          <RequesterInterface userId={currentUser.id} />
        ) : (
          <ValidatorInterface />
        )}
      </main>
    </div>
  );
}

export default App;

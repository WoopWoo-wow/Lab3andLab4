import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Students = () => {
  const { token, logout, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load student data (${response.status})`);
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Student Directory</h1>
          {user?.email && <p className="user-badge">Logged in as: {user.email}</p>}
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </header>

      {loading && <p className="status-message">Loading student records...</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && !error && (
        <ul className="student-list">
          {students.map((student) => (
            <li key={student._id || student.id} className="student-card">
              <h3>{student.name}</h3>
              <p>{student.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Students;
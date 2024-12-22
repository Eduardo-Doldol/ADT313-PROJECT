import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);

  return (
    <div className='main-container'>
      <div className='sidebar'>
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <a href='/main/movies'>Movies</a>
          </li>
          <li className='logout'>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>

      <div className='content'>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
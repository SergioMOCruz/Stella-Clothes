import { Route, Routes } from 'react-router-dom';
import ContextProvider from './app/contexts/context.jsx';
import Dash from './app/dash/dash';
import Login from './app/login/login';

function MyRouter() {
  return (
      <ContextProvider>
        <Routes>
          <Route exact path='*' element={<Login />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/dash/*' element={<Dash />} />
        </Routes>
      </ContextProvider>
  );
}

export default MyRouter;

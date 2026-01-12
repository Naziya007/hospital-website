import { Routes, Route ,Navigate} from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import Page from "./page";
import PrivateRoute  from "./component/PrivateRoute";


function App() {
  return (
    <>
    <Routes>
    
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
         {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Page/>
          </PrivateRoute>
        } />
    </Routes>
    </>
  );
}

export default App;


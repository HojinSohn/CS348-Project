import './App.css';
import { useState, useEffect } from "react"
import {getTest} from "./test"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./Page/Login";
import Home from "./Page/HomePage";
import CreateRecipePage from "./Page/CreateRecipePage";
import EditRecipePage from "./Page/EditRecipePage";

function App() {
  const [data, setData] = useState("HELOOOOOO THIS IS CS 348 PROJECT 1 BY HOJIN SOHN");
  const [token, setToken] = useState();

  useEffect(() => {
    // getTest()
    //   .then((res) => {
    //     setData(res.message);
    //   })
    //   .catch((err) => console.log(err));
      console.log(token);
  }, [token]);

  if(!token) {
      return <Login setToken={setToken} />
  }

  return (
    <div className="App">
        <BrowserRouter>
            <div className="pages">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/create-recipe"
                        element={<CreateRecipePage />}
                    />
                    <Route
                        path="/edit-recipe/:recipeID"
                        element={<EditRecipePage />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    </div>
  );
}

export default App;

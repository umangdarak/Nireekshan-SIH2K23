import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomeStack from "./Screens/HomeStack/HomeStack";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Header from "./Screens/misc/Header";
import { auth } from "./firebaseConfig";
export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);
  // if(!user){
  //   return <div
  //   style={{
  //     background:
  //       "url(src/assets/Nireekshan-high-resolution-logo-transparent.png)",
  //     backgroundSize: "cover",
  //     backgroundPosition: "center",
      
  //     transition: "transform 0.5s ease-in-out ",
  //     transform: "rotate(360deg)",

  //     height: "100vh",
  //   }}
  //   className=" flex  flex-col w-full h-full"
  // ></div>
  // }

  return (
    <BrowserRouter>
      <Routes>
        {/* Common route for unauthenticated users */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/home" /> : <Navigate to="/login" replace />
          }
        />
        {/* Login and Register routes for unauthenticated users */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        {/* Home route for authenticated users */}
        {user && <Route path="/home" element={<HomeStack />} />}
        {/* Add a catch-all route for any unknown paths */}
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

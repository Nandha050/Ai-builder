import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

export default function App() {
  const [page, setPage] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return page === "login" ? (
      <Login
        onSuccess={() => setLoggedIn(true)}
        onSwitch={() => setPage("register")}
      />
    ) : (
      <Register
        onSuccess={() => setLoggedIn(true)}
        onSwitch={() => setPage("login")}
      />
    );
  }

  return <Chat />;
}

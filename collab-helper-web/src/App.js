import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Application from "./Components/Application";
import UserProvider from "./providers/UserProvider";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <UserProvider>
          <Application />
        </UserProvider>
      </Container>
    </>
  );
}
export default App;

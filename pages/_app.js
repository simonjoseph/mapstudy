import { Card, studioTheme, ThemeProvider, usePrefersDark } from "@sanity/ui";
import React from "react";

import "../global-styles.css";

function App({ Component, pageProps }) {
  // This value will change when the system switches
  // between dark and light scheme.
  const prefersDark = usePrefersDark();

  // The theme system supports either "dark" or "light"
  const scheme = prefersDark ? "dark" : "light";

  return (
    <ThemeProvider scheme={scheme} theme={studioTheme}>
      <Card style={{ minHeight: "100vh" }}>
        <Component {...pageProps} />
      </Card>
    </ThemeProvider>
  );
}

export default App;

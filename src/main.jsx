import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

// Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

// Tailwind css
import "./tailwind.css";

// Router
import { RouterProvider } from "react-router-dom";
import router from "./router/index";

// Redux
import { Provider } from "react-redux";
import store from "./store/index";

// Mantine
// import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense>
      <Provider store={store}>
        {/* <MantineProvider> */}
        <RouterProvider router={router} />
        {/* </MantineProvider> */}
      </Provider>
    </Suspense>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Toaster
        toastOptions={{
          style: {
            maxWidth: "600px",
          },
        }}
      />
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
    ,
  </BrowserRouter>
);

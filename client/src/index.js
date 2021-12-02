// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";

// import { positions, Provider as AlertProvider } from "react-alert";
// import { Provider } from "react-redux";
// import store from "./store";

// const options = {
//   position: positions.MIDDLE,
// };

// ReactDOM.render(
//   <AlertProvider {...options}>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </AlertProvider>,
//   document.getElementById("root")
// );

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import * as serviceWorker from "./serviceWorker";

import App from "./App";
import reducers from "./reducers";

const store = createStore(reducers, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ESCalc from './ESCalc.tsx';
import CharacterBuilder from './Components/CharacterBuilder/CharacterBuilder.tsx';
import ItemBrowser from './Components/ItemBrowser/ItemBrowser.tsx';
import ErrorPage from "./Components/ErrorPage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './redux/store.ts';
import { Provider as ReduxProvider } from 'react-redux';

const router = createBrowserRouter([{
    path: "/",
    element: <ESCalc />,
    errorElement: <ErrorPage />,
    children: [
        {path: "/", element: <CharacterBuilder />},
        {path: "/items", element: <ItemBrowser />}
    ]
}]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <RouterProvider router={router} />
        </ReduxProvider>
    </React.StrictMode>
);

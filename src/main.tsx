import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ESCalc from './ESCalc.tsx';
import CharacterBuilder from './Components/CharacterBuilder.tsx';
import ItemBrowser from './Components/ItemBrowser.tsx';
import ErrorPage from "./Components/ErrorPage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <RouterProvider router={router} />
    </React.StrictMode>
);

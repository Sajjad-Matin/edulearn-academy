import { createBrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        errorElement: <div>Error occurred!</div>,
    }
]);

export default router;
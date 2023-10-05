import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminDashboard=()=>
{
    return (
        <div className="grid grid-cols-[1.5fr_5fr]">
            <Sidebar/>
            <Outlet/>
        </div>
    );
}
export default AdminDashboard;
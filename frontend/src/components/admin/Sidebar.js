import { Link } from "react-router-dom";
import DashHead from "./Dashhead";

const Sidebar=()=>
{
    return (
        <div className="font-poppins rounded-lg py-6 max-h-full my-4 mx-3">
        <DashHead/>
        <br/>
            <div>
                <Link to="/admin">
                <div className="flex pt-4 pb-4 items-center hover:text-[#0094FE]">
                    <div>
                    {/* icon */}
                    </div>
                    <h1 className="pl-3 text-[18px]">Tie-up Configuration</h1>
                </div>
                </Link>
            </div>

            <div>
                <Link to="/admin/gencomquery">
                <div className="flex pt-4 pb-4 items-center hover:text-[#0094FE]">
                    <div>
                    {/* icon */}
                    </div>
                    <h1 className="pl-3 text-[18px]">Group Community Queries</h1>
                </div>
                </Link>
            </div>

            <div>
                <Link to="/admin/generalqueries">
                <div className="flex pt-4 pb-4 items-center hover:text-[#0094FE]">
                    <div>
                    {/* icon */}
                    </div>
                    <h1 className="pl-3 text-[18px]">General Queries</h1>
                </div>
                </Link>
            </div>

            <div>
                <Link to="/admin/logochange">
                <div className="flex pt-4 pb-4 items-center hover:text-[#0094FE]">
                    <div>
                    {/* icon */}
                    </div>
                    <h1 className="pl-3 text-[18px]">Logo change</h1>
                </div>
                </Link>
            </div>

            <div>
                <Link to="/admin/advertisement">
                <div className="flex pt-4 pb-4 items-center hover:text-[#0094FE]">
                    <div>
                    {/* icon */}
                    </div>
                    <h1 className="pl-3 text-[18px]">Advertisement</h1>
                </div>
                </Link>
            </div>

            <div>
                <Link to="/admin/accounts">
                <div className="flex pt-4 pb-4 items-center hover:text-[#0094FE]">
                    <div>
                    {/* icon */}
                    </div>
                    <h1 className="pl-3 text-[18px]">Account Access</h1>
                </div>
                </Link>
            </div>


        </div>
    );
}
export default Sidebar;
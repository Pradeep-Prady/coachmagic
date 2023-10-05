import React from "react";
import { Link } from "react-router-dom";

const Accounts = () => {
  return (
    <div className="m-10">
      <div className="flex items-center justify-end bg-mylight p-3 rounded-md">
        <Link
          to="/admin/accounts/add"
          className="bg-black  text-white px-3 py-2 rounded-md "
        >
          Add Account
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="bg-mylight  m-5 p-3 rounded-lg">
            <div className="bg-white p-5 rounded-md">
              <div className="grid grid-cols-2 my-2">
                <p className="font-semibold"> Name</p>
                <p> Mano Sundar</p>
              </div>
              <div className="grid grid-cols-2 my-2">
                <p className="font-semibold">Email</p>
                <p>abc@gmail.com</p>
              </div>
              <div className="flex items-center justify-center  mt-7">
                <Link
                  className="border-black border-2 px-3 py-1 rounded-sm "
                  to="/admin/account/:id"
                >
                  <p className="text-[16px]">View Details</p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Accounts;

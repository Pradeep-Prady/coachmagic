import React from "react";
import { Link } from "react-router-dom";

export default function AccountDetails() {
  return (
    <div className=" flex w-4/6 items-center justify-start">
      <div className="bg-[#b3ddff]  my-5 sm:m-10 w-full sm:w-11/12 rounded-3xl ">
        <div className="bg-white m-2 sm:m-10 p-5 rounded-3xl ">
          <form>
            <div className=" grid grid-cols-2 py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold ">Name</h1>
              <p className="">Mano Sundar</p>
            </div>
            <div className="grid grid-cols-2 py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold">Email</h1>
              <p className="">abc@gmail.com</p>
            </div>
            <div className="grid grid-cols-2  py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold">Phone No</h1>
              <p className="">9876543210</p>
            </div>
            <div className="grid grid-cols-2 py-2 sm:p-2 my-2">
              <h1 className="font-semibold">Position</h1>
              <p className="">Admin</p>
            </div>

            <div className="flex items-center py-2 sm:p-2 my-5 justify-between">
              <Link
                to="/admin/account/:id/edit"
                className="bg-black px-3 py-2 rounded-sm text-white  "
              >
                Edit
              </Link>
              <button className="bg-black px-3 py-2 rounded-sm text-white  ">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

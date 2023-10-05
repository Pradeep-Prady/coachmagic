import React from "react";
import { Link } from "react-router-dom";

export default function TieUpConfigDetails() {
  return (
    <div className=" flex items-center justify-start">
      <div className="bg-[#b3ddff]  my-5 sm:m-10 w-full sm:w-11/12 rounded-3xl ">
        <div className="bg-white m-2 sm:m-10 p-5 rounded-3xl ">
          <form>
            <div className=" grid grid-cols-2 py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold ">Partner Type</h1>
              <p className="">College</p>
            </div>
            <div className="grid grid-cols-2 py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold">Partner Name</h1>
              <p className="">Mano Sundar</p>
            </div>
            <div className="grid grid-cols-2  py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold">Partner Email</h1>
              <p className="">abc@gmail.com</p>
            </div>
            <div className="grid grid-cols-2 py-2 sm:p-2 my-2">
              <h1 className="font-semibold">Subscription Duration</h1>
              <p className="">2 Years</p>
            </div>
            <div className="grid grid-cols-2 py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold">Subscription Amount</h1>
              <p className="">25000</p>
            </div>
            <div className="grid grid-cols-2  py-2 sm:p-2 my-2 ">
              <h1 className="font-semibold">Amount Status</h1>
              <p className="">Half Pay</p>
            </div>
            <div className="flex items-center py-2 sm:p-2 my-5 justify-between">
              <Link
                to="/admin/tieup/:id/edit"
                type="submit"
                className="bg-black px-3 py-2 rounded-sm text-white  "
              >
                Edit
              </Link>
              <button
                type="submit"
                className="bg-black px-3 py-2 rounded-sm text-white  "
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

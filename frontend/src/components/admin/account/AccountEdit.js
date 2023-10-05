import React from "react";

export default function AccountEdit() {
  return (
    <div className="grid m-10 w-3/6 grid-cols-1">
      <div className=" m-2 bg-[#b3ddff]  rounded-2xl">
        <div className="m-4 px-7  bg-white rounded-2xl">
          <h1 className=" text-[30px] text-center">Account Edit</h1>
          <div className="grid my-5 grid-cols-2">
            <h1 className="font-semibold">Name</h1>
            <input
              type="text"
              placeholder="Enter Name"
              className="p-2 border rounded ml-2"
            ></input>
          </div>
          <div className="grid my-5 grid-cols-2">
            <h1 className="font-semibold">Email ID</h1>
            <input
              type="email"
              placeholder="Enter Email"
              className="p-2 border rounded ml-2"
            ></input>
          </div>
          <div className="grid my-5 grid-cols-2">
            <h1 className="font-semibold">Phone No</h1>
            <input
              type="number"
              placeholder="Enter Phoneno"
              className="p-2 border rounded ml-2"
            ></input>
          </div>
          <div className="grid my-5 grid-cols-2">
            <h1 className="font-semibold">Position</h1>
            <input
              type="text"
              placeholder="Enter Position"
              className="p-2 border rounded ml-2"
            ></input>
          </div>
          <div className="flex justify-center pb-6">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-[#d8b4fe]">
              UPDATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

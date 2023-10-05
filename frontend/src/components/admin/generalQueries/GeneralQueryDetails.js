import React, { useState } from "react";
import Proof from "../../../assets/img/CM_newlogo1.jpg";

export default function GeneralQueryDetails() {
  const [status, setStatus] = useState("inProgress");

  return (
    <div className=" flex items-center justify-start">
    <div className="bg-[#b3ddff]  my-5 sm:m-10 w-full sm:w-11/12 rounded-3xl ">
      <div className="bg-white m-2 sm:m-10 p-5 rounded-3xl ">
        <form>
          <div className=" grid grid-cols-2 py-2 sm:p-2 my-2 ">
            <h1 className="font-semibold ">Query About</h1>
            <p className="">Application Feedback</p>
          </div>
          <div className="grid grid-cols-2 py-2 sm:p-2 my-2 ">
            <h1 className="font-semibold">Name</h1>
            <p className="">Mano Sundar</p>
          </div>
          <div className="grid grid-cols-2  py-2 sm:p-2 my-2 ">
            <h1 className="font-semibold">Fake Account ID Name</h1>
            <p className="">Disabled</p>
          </div>
          <div className="grid grid-cols-2 py-2 sm:p-2 my-2">
            <h1 className="font-semibold">Reason About</h1>
            <p className="">
              It is a long established fact that a reader will be distracted
              by the readable content of a page when looking at its layout.
              The point of using Lorem Ipsum is that it has a more-or-less
              normal distribution of letters.
            </p>
          </div>
          <div className="grid grid-cols-2 py-2 sm:p-2 my-2 ">
            <h1 className="font-semibold">Proof Of Reason</h1>
            <img className="w-[150px]" src={Proof} alt="ReasonProofImg" />
          </div>
          <div className="grid grid-cols-2  py-2 sm:p-2 my-2 ">
            <h1 className="font-semibold">Status of Feedback</h1>

            <select
              onChange={(e) => setStatus(e.target.value)}
              className={` ${
                status === "inProgress" ? "text-red-500" : "text-green-500"
              }  outline-none cursor-pointer `}
            >
              <option className="text-black" value="inProgress ">
                In Progress
              </option>
              <option className="text-black" value="completed">
                Completed
              </option>
            </select>
          </div>
          <div className="flex items-center py-2 sm:p-2 my-5 justify-center">
            <button
              type="submit"
              className="bg-black px-3 py-2 rounded-sm text-white  "
            >
              Action Taken
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

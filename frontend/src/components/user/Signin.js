import React, { useState } from "react";
import Logo from "../../assets/img/CM_newlogo1.jpg";
import Signup from "./Signup";
const Signin = () => {
  const [setSignup, showSignup] = useState(false);
  const handleSignup = () => {
    showSignup(!setSignup);
  };
  return (
    <div>
      {!setSignup && (
        <div className="flex justify-center items-center p-7 text-[black]">
          <div className="border-[1px] border-dotted rounded-[10px] border-[black] w-2/6 container p-5">
            <div className="flex justify-center gap-4 mt-1">
              <img className="md:w-48 lg:w-40 xl:w-48" src={Logo} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="mt-2.5 font-bold text-2xl">Login</h3>
              <p className="">Glad you're back...!</p>
              <label className="my-1.5">
                <input
                  type="text"
                  placeholder="Username/Email"
                  className="bg-transparent w-full text-sm  px-4 py-3 bg-gray-900 border  border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 to-blue-500"
                />
              </label>
              <label className="my-1.5">
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-transparent w-full text-sm  px-4 py-3 bg-gray-900 border  border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 to-blue-500"
                />
              </label>
              <label className="flex items-center space-x-1 ring-black border-1">
                <input
                  className="checkbox checkbox-sm shrink-0 rounded-sm focus:ring:0 accent-indigo-500 to-blue-500"
                  type="checkbox"
                  class="checkbox"
                />
                <span class="select-none text-sm ml-2 ">Remember Me</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  className="checkbox checkbox-sm shrink-0 rounded-sm focus:ring:0 accent-indigo-500 to-blue-500"
                  type="checkbox"
                  class="checkbox"
                />
                <span class="select-none text-sm ml-2 ">
                  I agree with the terms and conditions
                </span>
              </label>
              <div className="btn mt-2 flex justify-center">
                <button className="w-3/6 text-[white]  hover:text-[gray] p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500 bg-gradient-to-r from-indigo-500 to-blue-500">
                  Login
                </button>
              </div>
              <a
                href=""
                className="flex justify-center hover:underline hover:text-white-500 mt-3"
              >
                Forgot username/email?
              </a>
              <label>
                <p className="text-center hover:underline hover:text-white-500">
                  Don't have an account?
                  <button className="text-[black]" onClick={handleSignup}>
                    Signup
                  </button>
                </p>
              </label>
              <div className="footer rounded-[10px] grid grid-cols-2 mt-2">
                <a
                  href=""
                  className="text-[black] flex justify-start hover:underline hover:text-white-500"
                >
                  Support
                </a>
                <a
                  href=""
                  className="text-[black]  flex justify-end hover:underline hover:text-white-500"
                >
                  Customer Care
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {setSignup && <Signup />}
    </div>
  );
};

export default Signin;

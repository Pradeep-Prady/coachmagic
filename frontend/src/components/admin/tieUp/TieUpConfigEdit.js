import React from 'react'

export default function TieUpConfigEdit() {
  return (
    <div className="flex items-center m-10 font-poppins">
    <div className="bg-[#b3ddff]  rounded-2xl m-2 h-full ">
      <div className="bg-white m-4 rounded-2xl p-5">
        <h2 className="flex justify-center m-4 font-bold text-[1.5em]">
          Tie-Up Configuration
        </h2>
        <br />
        <div className="grid grid-cols-[1fr_0.3fr_4fr] m-3">
          <label htmlFor="partner_type" className="flex items-center">
            Partner Type
          </label>
          <p className="flex items-center">:</p>
          <select
            id="partner_type"
            name="partnet_type"
            className="border border-b-3 p-2 rounded-sm focus:outline-gray-400"
          >
            <option value="1">Select one</option>
            <option value="2">School</option>
            <option value="3">college</option>
          </select>
        </div>
        <div className="grid grid-cols-[1fr_0.3fr_4fr] m-3">
          <label htmlFor="partner_name" className="flex items-center">
            Partner Name
          </label>
          <p className="flex items-center">:</p>
          <input
            id="partner_name"
            name="partner_name"
            type="text"
            className="border p-2 border-b-3 rounded-sm focus:outline-gray-400"
            placeholder="Enter the Partner Name"
          />
        </div>
        <div className="grid grid-cols-[1fr_0.3fr_4fr] m-3">
          <label htmlFor="partner_email" className="flex items-center">
            Partner Email
          </label>
          <p className="flex items-center">:</p>
          <input
            type="text"
            id="partner_email"
            name="partner_email"
            className="p-2 border border-b-3 rounded-sm focus:outline-gray-400"
            placeholder="Enter the Partner Email"
          />
        </div>
        <div className="grid grid-cols-[1fr_0.3fr_4fr] m-3">
          <label htmlFor="partner_years" className="flex items-center">
            Subscription Duration(years)
          </label>
          <p className="flex items-center">:</p>
          <input
            type="number"
            id="partner_years"
            name="partner_years"
            min={0.1}
            max={100}
            className="border p-2 border-b-3 rounded-sm focus:outline-gray-400"
            placeholder="Enter the Subscription Duration"
          />
        </div>
        <div className="grid grid-cols-[1fr_0.3fr_4fr] m-3">
          <label htmlFor="amount" className="flex items-center">
            Subscription Amount{" "}
          </label>
          <p className="flex items-center">:</p>
          <input
            type="text"
            id="amount"
            name="amount"
            className="border border-b-3 p-2 rounded-sm focus:outline-gray-400"
            placeholder="Enter the Subscription Amount Discussed"
          />
        </div>
        <div className="grid grid-cols-[1fr_0.3fr_4fr] m-3">
          <label htmlFor="amount_status" className="flex items-center">
            Amount Status
          </label>
          <p className="flex items-center">:</p>
          <select
            id="amount_status"
            name="amount_status"
            className="border border-b-3 p-2 rounded-sm focus:outline-gray-400"
          >
            <option value="1">Select one</option>
            <option value="2">Full pay</option>
            <option value="3">Half pay</option>
            <option value="3">Pending</option>
          </select>
        </div>
        <br />
        <br />
        <br />
        <div className="flex justify-center">
          <button className="bg-black  text-white px-4 py-2 rounded hover:bg-[#d8b4fe] hover:text-black shadow-md">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

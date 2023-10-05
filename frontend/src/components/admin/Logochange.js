import React,{useState} from "react";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Logochange=()=>
{
    const customColor ='#d8b4fe';

  const buttonStyle = {
    backgroundColor: customColor,
    color: 'black',
  };
  
    return(
        <div>
            <div className="grid grid-cols-1">
                <div className=" m-4 bg-[#b3ddff]  rounded-2xl">
                    <div className="m-4 bg-white rounded-2xl">
                    <h1 className="font-bold text-[30px] text-center">Logo Change</h1>
                    <div className="flex flex-2 mt-4 pl-12 mb-4">
                      <h1 className="font-semibold mr-5">Update the logo:</h1>
                      <Button variant="contained" style={buttonStyle} className="mb-4" startIcon={<CloudUploadIcon />}>Upload</Button>
                    </div>
                    <div className="flex flex-2 pl-12 pb-6">
                        <h1 className="font-semibold">Reason for updating:</h1>
                        <input type="text" placeholder="Enter Reason" className="p-2 border rounded ml-2"></input>
                    </div>
                    <div className="flex justify-center pb-6">
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-[#d8b4fe]">UPDATE</button>
                    </div>
                    </div>
                </div>
           
            </div>
        </div>
    )

}
export default Logochange;
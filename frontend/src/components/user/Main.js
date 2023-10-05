import React from 'react'
import Sidebar from '../userlayouts/Sidebar'
import { Outlet } from 'react-router-dom'

const Main = () => {
  return (
    <div className='flex'>
        <Sidebar/>
        <Outlet/>
    </div>
  )
}

export default Main
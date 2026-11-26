/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import axios from 'axios'
import { User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Stats = {
  totalApprovedPartners: number
  totalPartners: number
  totalPendingPartners: number
  totalRejectedPartners: number
}

const AdminDashboard = () => {



  const [stats, setStats] = useState<Stats | null>(null)

  const handleGetData = async () => {
    try {
      const {data} = await axios.get("/api/admin/dashboard")
      setStats(data.stats)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetData()
  }, [])

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
      <div className='sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40'>
        <div className='max-w-7xl mx-auto h-16 px-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image src={"/logo.png"} alt='logo' width={44} height={44} priority/>
          </div>
          <div className='flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-black text-white'>
            <User size={14}/>
            Admin Dashboard
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
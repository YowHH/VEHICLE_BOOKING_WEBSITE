/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {

  const {id} = useParams()

  const handleGetPartner = async () => {

    try {
      const {data} = await axios.get(`/api/admin/reviews/partner/${id}`)
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetPartner()
  }, [])
  
  return (
    <div>
      
    </div>
  )
}

export default page
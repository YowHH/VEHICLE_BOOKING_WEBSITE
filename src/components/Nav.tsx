'use client'

import React, { useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthModal from './AuthModal'

const Nav_Items=["Home", "Bookings", "About Us", "Contact"]

const Nav = () => {

    const pathname = usePathname()
    const [authOpen, setAuthOpen] = useState(false)

    return (
        <>
            <motion.div initial={{ opacity: 0, y: -60}} animate={{ opacity: 1, y: 0}}
            className={`fixed top-3 left-1/2 -translate-x-1/2 w-[94%] md:w-[86%] z-50 rounded-full bg-[#0b0b0b] text-white
            shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3`}>
                <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>
                    <Image src={"/logo.png"} alt='logo' width={44} height={44} priority/>
                    <div>
                        {Nav_Items.map((i,index) => {
                        let href;
                        if(i=="Home"){
                            href = `/`
                        } else {
                            href = `/${i.toLowerCase()}`
                        }
                            const active = href == pathname
                            return <Link href={href} key={index}
                            className={`text-sm pl-2 font-medium transition ${active ? "text-white" : "text-gray-400 hover:text-white"}`}>
                                {i}
                            </Link>
                        })}
                    </div>
                    <button className='px-4 py-1.5 rounded-full bg-white text-black text-sm'
                    onClick={()=>setAuthOpen(true)}>
                        Login
                    </button>
                </div>
                
                
            </motion.div>
            <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)}/>
        </>
        
    )
}

export default Nav
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React from 'react'
import { motion } from "motion/react"
import { ArrowLeft, BadgeCheck, CheckCircle, CreditCard, Landmark, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

const page = () => {

    const router = useRouter()
    
    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div initial={{ opacity: 0, y: 28}} animate={{ opacity: 1, y: 0}}
            className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'>
                <div className='relative text-center'>
                    <button className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center
                    hover:bg-gray-100 transition' onClick={() => router.back()}>
                        <ArrowLeft size={18}/>
                    </button>
                    <p className='text-xs text-gray-500 font-medium'>
                        Step 3 of 3
                    </p>
                    <h1 className='text-2xl font-bold mt-1'>
                        Bank and Payment Setup
                    </h1>
                    <p className='text-sm text-gray-500 mt-2'>
                        Used for partner payment
                    </p>
                </div>
                <div className='mt-8 space-y-6'>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            Account Holder Name
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'>
                                <BadgeCheck/>
                            </div>
                            <input type="text"  placeholder='As per bank record' id='ahn'
                            className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black'/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            Bank Account Number
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'>
                                <CreditCard/>
                            </div>
                            <input type="text"  placeholder='Enter account number' id='ahn'
                            className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black'/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            Swift Code
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'>
                                <Landmark/>
                            </div>
                            <input type="text"  placeholder='HFGC0012345' id='ahn'
                            className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black'/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>
                            Mobile Number
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'>
                                <Phone/>
                            </div>
                            <input type="text"  placeholder='10 digit mobile number' id='ahn'
                            className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black'/>
                        </div>
                        
                    </div>
                    <div>
                        <label htmlFor="paymentHandle" className="text-xs font-semibold text-gray-500">
                            Payment ID (optional)
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                name="paymentHandleType"
                                defaultValue=""
                                className="border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black bg-transparent text-gray-600"
                            >
                                {/* 这个选项只作为外面的占位显示，点开时隐藏且不可选 */}
                                <option value="" disabled hidden>
                                    Type
                                </option>
                                
                                <option value="duitnow">DuitNow</option>
                                <option value="upi">UPI</option>
                                <option value="paynow">PayNow</option>
                                <option value="promptpay">PromptPay</option>
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="other">Other</option>
                            </select>
                            <input
                                type="text"
                                id="paymentHandle"
                                name="paymentHandle"
                                placeholder="e.g. 0123456789 or name@bank"
                                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black"
                            />
                        </div>
                    </div>
                </div>
                <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
                    <CheckCircle size={16} className='mt-0.5'/>
                    <p>
                        Bank etails are verified before first payment.
                        This usually takes 24 - 48 hours.
                    </p>
                </div>
                <motion.button whileHover={{scale: 1.02}} whileTap={{scale: 0.97}}
                className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semiboldflex items-center justify-center gap-2
                disabled:opacity-40 transition'>
                    Continue
                </motion.button>
            </motion.div>
        </div>
    )
}

export default page
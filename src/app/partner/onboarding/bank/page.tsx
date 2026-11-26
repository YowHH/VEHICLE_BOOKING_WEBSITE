/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const page = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [accountHolder, setAccountHolder] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [bankCode, setBankCode] = useState("")
    const [paymentHandle, setPaymentHandle] = useState("")
    const [paymentHandleType, setPaymentHandleType] = useState<"duitnow" | "upi" | "paynow" | "promptpay" | "phone" | "email" | "other">("upi")

    const handleBank = async () => {
        if (!accountHolder.trim() || !accountNumber.trim() || !bankCode.trim()) {
            setError("Please fill in Account Holder Name, Account Number, and Bank Routing Code.")
            return
        }
        if (accountHolder.trim().length < 3) return setError("Account Holder Name must be at least 3 characters.")
        if (accountNumber.trim().length < 8) return setError("Account Number must be at least 8 characters.")
        if (bankCode.trim().length < 8) return setError("Bank Routing Code must be at least 8 characters.")
        const cleanHandle = paymentHandle.trim()
        if (cleanHandle !== "") {
            if (cleanHandle.length < 3) {
                return setError("Payment ID is too short.")
            }
            switch (paymentHandleType) {
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanHandle)) {
                        return setError("Please enter a valid email address.")
                    }
                    break;
                case "phone":
                case "promptpay":
                    if (!/^\d{9,15}$/.test(cleanHandle)) {
                        return setError("Please enter a valid phone number (9-15 digits).")
                    }
                    break;
                case "upi":
                    if (!/^[\w.-]+@[\w.-]+$/.test(cleanHandle)) {
                        return setError("Please enter a valid UPI ID (e.g., name@bank).")
                    }
                    break;
                case "duitnow":
                case "paynow":
                    if (cleanHandle.length < 7) {
                        return setError(`Please enter a valid ${paymentHandleType} ID.`)
                    }
                    break;
                case "other":
                    break;
            }
        }

        setLoading(true)
        setError("")
        
        try {
            const payload: any = {
                accountHolder: accountHolder.trim(),
                accountNumber: accountNumber.trim().toUpperCase(),
                bankCode: bankCode.trim().toUpperCase(),
            }
            
            if (cleanHandle !== "") {
                payload.paymentHandle = cleanHandle
                payload.paymentHandleType = paymentHandleType
            }

            const { data } = await axios.post("/api/partner/onboarding/bank", payload)
            console.log("Success:", data);
            // router.push('/next-step')
            
        } catch (error: any) {
            console.error("Backend Error:", error);
            setError(error?.response?.data?.message ?? "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const getPlaceholder = () => {
        switch (paymentHandleType) {
            case "email": return "e.g. name@domain.com";
            case "phone": return "e.g. 0123456789";
            case "upi": return "e.g. name@okicici";
            case "promptpay": return "e.g. 0812345678";
            case "duitnow": return "e.g. 0123456789 or ID";
            case "paynow": return "e.g. 91234567 or UEN";
            default: return "Enter payment ID";
        }
    }

    useEffect(() => {
        const handleGetBank = async () => {
            try {
                const { data } = await axios.get("/api/partner/onboarding/bank")
                console.log(data);
                setAccountHolder(data.partnerBank.accountHolder)
                setAccountNumber(data.partnerBank.accountNumber)
                setBankCode(data.partnerBank.bankCode)
            } catch (error) {
                console.log(error);
            }
        }
        handleGetBank()
    }, [])

    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div initial={{ opacity: 0, y: 28}} animate={{ opacity: 1, y: 0}}
            className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'>
                <div className='relative text-center'>
                    <button className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition' onClick={() => router.back()}>
                        <ArrowLeft size={18}/>
                    </button>
                    <p className='text-xs text-gray-500 font-medium'>Step 3 of 3</p>
                    <h1 className='text-2xl font-bold mt-1'>Bank and Payment Setup</h1>
                    <p className='text-sm text-gray-500 mt-2'>Used for partner payment</p>
                </div>

                <div className='mt-8 space-y-6'>
                    <div>
                        <label htmlFor="accountHolder" className='text-xs font-semibold text-gray-500'>
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><BadgeCheck /></div>
                            <input type="text" placeholder='As per bank record' id='accountHolder'
                                minLength={3}
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black'
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="accountNumber" className='text-xs font-semibold text-gray-500'>
                            Account Number / IBAN <span className="text-red-500">*</span>
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><CreditCard /></div>
                            <input type="text" placeholder='Enter account number or IBAN' id='accountNumber'
                                minLength={8}
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black uppercase'
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)} /> 
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bankCode" className='text-xs font-semibold text-gray-500'>
                            Bank Routing Code (IFSC / SWIFT) <span className="text-red-500">*</span>
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Landmark /></div>
                            <input type="text" placeholder='e.g. HDFC0001234 or HFGC0012345' id='bankCode'
                                minLength={8}
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black uppercase'
                                value={bankCode}
                                onChange={(e) => setBankCode(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="paymentHandle" className="text-xs font-semibold text-gray-500">Payment ID (optional)</label>
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                value={paymentHandleType}
                                onChange={(e) => {
                                    setPaymentHandleType(e.target.value as any)
                                    setPaymentHandle("") 
                                }}
                                className="border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black bg-transparent text-gray-600 cursor-pointer"
                            >
                                <option value="duitnow">DuitNow</option>
                                <option value="upi">UPI</option>
                                <option value="paynow">PayNow</option>
                                <option value="promptpay">PromptPay</option>
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="text" id="paymentHandle" placeholder={getPlaceholder()}
                                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black"
                                value={paymentHandle}
                                onChange={(e) => setPaymentHandle(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {error && <p className='text-red-500 mt-4 text-sm'>*{error}</p>}
                <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
                    <CheckCircle size={16} className='mt-0.5'/>
                    <p>Bank details are verified before first payment. This usually takes 24 - 48 hours.</p>
                </div>
                
                <motion.button whileHover={{scale: 1.02}} whileTap={{scale: 0.97}} onClick={handleBank} disabled={loading}
                className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'>
                    {loading ? <CircleDashed className='text-white animate-spin'/> :"Continue"}
                </motion.button>
            </motion.div>
        </div>
    )
}

export default page
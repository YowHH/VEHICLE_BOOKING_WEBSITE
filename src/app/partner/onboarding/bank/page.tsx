/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useState } from 'react'
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
        // 1. 严格校验前三个必填项
        if (!accountHolder.trim() || !accountNumber.trim() || !bankCode.trim()) {
            setError("Please fill in Account Holder Name, Account Number, and Bank Routing Code.")
            return
        }

        setLoading(true)
        setError("")
        
        try {
            // 2. 构建 Payload，并在这里统一处理转大写和去空格
            const payload: any = {
                accountHolder: accountHolder.trim(),
                accountNumber: accountNumber.trim().toUpperCase(),
                bankCode: bankCode.trim().toUpperCase(),
            }
            
            // 3. 只有支付ID有内容时，才加入到 payload 中发给后端
            if (paymentHandle.trim() !== "") {
                payload.paymentHandle = paymentHandle.trim()
                payload.paymentHandleType = paymentHandleType
            }

            console.log("Payload sent to backend:", payload); // 方便调试

            const { data } = await axios.post("/api/partner/onboarding/bank", payload)
            console.log("Success:", data);
            
            // 上传成功后的跳转逻辑，请自行修改路径
            // router.push("/partner/dashboard")
            
        } catch (error: any) {
            console.error("Backend Error:", error);
            setError(error?.response?.data?.message ?? "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

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
                    {/* 1. 户名 (必填) */}
                    <div>
                        <label htmlFor="accountHolder" className='text-xs font-semibold text-gray-500'>
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><BadgeCheck /></div>
                            <input type="text" placeholder='As per bank record' id='accountHolder'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black'
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)} />
                        </div>
                    </div>

                    {/* 2. 账号 / IBAN (必填) */}
                    <div>
                        <label htmlFor="accountNumber" className='text-xs font-semibold text-gray-500'>
                            Account Number / IBAN <span className="text-red-500">*</span>
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><CreditCard /></div>
                            <input type="text" placeholder='Enter account number or IBAN' id='accountNumber'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black uppercase'
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)} /> 
                                {/* 修复：去掉了 .toUpperCase()，改用 CSS uppercase，防止输入光标跳动 */}
                        </div>
                    </div>

                    {/* 3. 银行路由代码 (必填) */}
                    <div>
                        <label htmlFor="bankCode" className='text-xs font-semibold text-gray-500'>
                            Bank Routing Code (IFSC / SWIFT) <span className="text-red-500">*</span>
                        </label>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Landmark /></div>
                            <input type="text" placeholder='e.g. HDFC0001234 or HFGC0012345' id='bankCode'
                                className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-200 focus:border-black uppercase'
                                value={bankCode}
                                onChange={(e) => setBankCode(e.target.value)} />
                                {/* 修复：去掉了 .toUpperCase()，改用 CSS uppercase */}
                        </div>
                    </div>

                    {/* 4. Payment Handle (选填) */}
                    <div>
                        <label htmlFor="paymentHandle" className="text-xs font-semibold text-gray-500">Payment ID (optional)</label>
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                value={paymentHandleType}
                                onChange={(e) => setPaymentHandleType(e.target.value as any)}
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
                            <input type="text" id="paymentHandle" placeholder="e.g. 0123456789 or name@bank"
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
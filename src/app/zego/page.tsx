/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client'

import React, { useRef } from 'react'

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const page = () => {
    const {userData} = useSelector((state: RootState) => state.user )

    const containerRef = useRef<HTMLDivElement>(null)
    const startCall = async () =>{
    const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt')

        if(!containerRef){
            return null
        }
        try {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId,
                serverSecret!,
                "jhgfdsa",
                userData?._id.toString()!,
                "yow"
            )
            const zp = ZegoUIKitPrebuilt.create(kitToken)
            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                showPreJoinView: false
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div ref={containerRef} className='h-screen'>
            <button onClick={startCall}>Click</button>
        </div>
    )
}

export default page
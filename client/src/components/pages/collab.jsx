import React from "react";

export default function Collab() {
    return (
        <>
            <div className="w-full h-full">
            </div>
            <div className="w-full bg-first h-screen flex flex-row  justify-center ">
                <div className="w-[20%] h-[70%] p-4 ">
                    <div className="rounded-lg bg-second h-full ">

                    </div>
                </div>
                <div className="w-[40%] h-full flex flex-col p-4 gap-2">
                    <div className=" w-full bg-second rounded-lg h-40 ">
                        <div className=" flex flex-col">
                            <div className="flex flex-row gap-4 p-4 justify-center items-center">
                                <img src={require('../../images/2.png')} className="w-16 h-16 rounded-full" alt="" />
                                <button className="w-full rounded-3xl border-text-one hover:border-text-two border-2 h-12 text-white"> Share a Post! </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[100%] border border-l-white  rounded-lg  overflow-x-hidden  p-4">

                    </div>
                </div>
                <div className="w-[20%] p-4 h-screen">
                    <div className="rounded-lg bg-second h-full ">

                    </div>
                </div>
            </div>
        </>
    )
}
import React from "react";
import "../index.css"


export default function LoadingPage() {
    return (
        <body className="bg-white w-screen h-screen ">
            <div className="flex flex-col">
                <div className="justify-center content-center  h-screen">
                    <div className="flex justify-center content-center flex-col border-[#bdb9b9] border rounded-xl h-160">
                        <div className="mt-10">
                            <p className="text-8xl inline-block text-green-400 font-bold ">SOLVE</p>
                            <p className="text-xl inline-block text-gray-800">ME</p>
                        </div>

                        <div className="flex flex-col mt-36 ">
                            <div className="flex content-center justify-center">
                                <div className="">
                                    <button className="border-black border w-6 h-6 bg-white rounded-sm"></button>
                                </div>
                                <div className="flex">
                                    <p className="content-center ml-4 text-[10px] text-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore, facere!</p>
                                </div>
                            </div>

                            <div className="flex content-center justify-center">
                                <div className="flex content-center justify-center bg-emerald-400 w-35 h-10 rounded-xl mt-8">
                                    <div className="flex justify-center content-center">
                                        <button className="text-xl font-bold text-amber-50">Line Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}
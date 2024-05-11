import React from "react";
import { motion } from "framer-motion";

export default function Feature({ featureref, featureinview }) {
    return (
        <div ref={featureref} className="w-full h-[110vh] gap-8 bg-background flex flex-col pl-32 pt-20 ">
            <div className="flex justify-center items-center text-heading font-bold text-7xl">
                {'{ '}FeaTures{' }'}
                <div className="text-2xl font-semibold flex items-center justify-center h-full ml-4">
                    We Provide
                </div>
            </div>
            <div className="flex items-center justify-center relative">
                <div className="w-full h-full flex  justify-center absolute top-0 left-0">
                    <svg width="144" height="801" viewBox="0 0 144 801" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M71.6015 10C33.3248 61.8324 -17.4669 183.946 85.5809 257.741C188.629 331.537 119.198 464.778 71.6015 522.174C21.3425 583.085 -49.0203 722.124 71.6015 791" stroke="#FFFCE1" stroke-width="5" />
                        <circle cx="72" cy="10" r="10" fill="#FF8709" />
                        <circle cx="25" cy="159" r="5" fill="#FF8709" />
                        <circle cx="139" cy="362" r="5" fill="#FF8709" />
                        <circle cx="5" cy="667" r="5" fill="#FF8709" />
                        <circle cx="72" cy="791" r="10" fill="#FF8709" />
                    </svg>
                </div>
                <div className="absolute text-white bg-red-600 right-0 left-0">
                    {/* <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: featureinview ? 1 : 0,
                        }}
                        transition={{
                            duration: 2,
                        }}
                        className="absolute flex flex-row"
                    >
                        <p></p>
                    </motion.div> */}
                </div>


            </div>
        </div>
    )
}
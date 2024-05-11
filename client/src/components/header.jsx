import React from "react";
import { motion } from "framer-motion";

export default function Header({ loginref, aboutref, homeref, featureref }) {
    return (
        <div className="w-full flex bg-background z-50 fixed justify-center h-20 ">
            <div className="w-[90%]  h-full p-4 border-b flex items-center border-border">
                <motion.img onClick={() => {
                    homeref.current?.scrollIntoView({
                        behavior: "smooth",
                    })
                }} width="60" whileHover={{ rotateZ: 180 }} height="60" src="https://img.icons8.com/ios-glyphs/90/FFFCE1/angry.png" alt="angry" />
                <div className="flex ml-16 font-pt flex-row gap-8">
                    <div href="" onClick={() => {
                        aboutref.current?.scrollIntoView({
                            behavior: "smooth",
                        })
                    }} className="text-heading opacity-50 hover:opacity-100 font-medium text-lg hover:text-heading transition-all duration-200">ABOUT US</div>
                    <div href="" onClick={() => {
                        featureref.current?.scrollIntoView({
                            behavior: "smooth",
                        })
                    }}
                        className="text-heading opacity-50 hover:opacity-100 font-medium  text-lg hover:text-heading transition-all duration-200">FEATURES</div>
                    <div href="" className="text-heading opacity-50 hover:opacity-100 font-medium  text-lg hover:text-heading transition-all duration-200">ABOUT US</div>
                    <div href="" className="text-heading opacity-50 hover:opacity-100 font-medium d text-lg hover:text-heading transition-all duration-200">ABOUT US</div>
                </div>
                <motion.button className="w-36 hover:bg-heading hover:text-background transition-all duration-300 h-12 ml-auto rounded-full border-heading border-2 flex justify-center items-center text-heading font-semibold"
                    onClick={() => {
                        loginref.current?.scrollIntoView({
                            behavior: "smooth",
                            offset: '100'
                        })
                    }}
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: .1 },
                    }}
                    whileTap={{ scale: 0.1 }}
                >GET ANIME</motion.button>

            </div>

        </div>
    )
}
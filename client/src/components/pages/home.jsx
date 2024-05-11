import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useInView } from "framer-motion";
import Header from "../header";
import first from "../../first.gif"
import second from "../../second.gif"
import arrow from "../arroww.json"
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import Login from "../login";
import Feature from "../feature";
import { useIsInViewport } from "../inview";
import SignUp from "../signup";


export default function Home() {
    const homeref = useRef(null)
    const homeinview = useIsInViewport(homeref)
    const aboutref = useRef(null)
    const aboutinview = useIsInViewport(aboutref)
    const featureref = useRef(null)
    const featureinview = useIsInViewport(featureref)
    const loginref = useRef(null)
    const logininview = useIsInViewport(loginref)
    const [logfocus, setLogfocus] = useState(true)
    const [showLogin, setShowLogin] = useState(true);
    const [ani, setAni] = useState(first)
    const inview = useInView(aboutref)

    // const ToggleLogin = () =>{
    //     setShowLogin(!showLogin)
    // }

    useEffect(() => {
        if (aboutinview) {
            setLogfocus(false)
        }
    }, [aboutinview])
    useEffect(() => {
        const intervalId = setInterval(() => {
            setAni((prevAni) => (prevAni === first ? second : first));
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="flex flex-row w-full h-[400vh] overflow-hidden scroll-smooth">
            <div className="flex flex-col">
                <div ref={homeref} className="w-full h-[100vh] bg-background border-b-2 border-border border">
                    <Header className="mt-auto" loginref={loginref} homeref={homeref} aboutref={aboutref} featureref={featureref} />
                    <motion.div
                        className="text-heading font-pt text-7xl pt-24 flex flex-row items-center justify-center h-full"
                    >
                        <div className="w-[65%] h-full flex gap-8 flex-col pt-24 pl-32">
                            <motion.div
                                initial={{ x: -400 }}
                                animate={{ x: 0, rotate: 720 }}
                                transition={{ duration: 1 }}
                                className="w-20 h-20 relative left-28 z-10 top-8">
                                <svg viewBox="0 0 137 135" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z" fill="url(#paint0_linear_1655_45397)"></path>
                                    <path d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z" fill="url(#pattern-home-hero-windmill-0)" fill-opacity="0.6" style={{ mixBlendMode: 'multiply' }}
                                    ></path>
                                    <defs>
                                        <pattern id="pattern-home-hero-windmill-0" patternContentUnits="objectBoundingBox" width="1.45985" height="1.48148">
                                            <use transform="scale(0.00291971 0.00296296)"></use>
                                        </pattern>
                                        <linearGradient id="paint0_linear_1655_45397" x1="-76.6791" y1="-15.6157" x2="165.682" y2="81.0082" gradientUnits="userSpaceOnUse">
                                            <stop offset="0.427083" stop-color="#FF8709"></stop>
                                            <stop offset="0.791667" stop-color="#F7BDF8"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.div>

                            <motion.p initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0, }} transition={{ duration: 1 }} className="font-pt text-[180px] font-medium">Animit</motion.p>
                            <p className="font -pt text-2xl line-clamp-4 font-normal">Animit allows you to effortlessly animate anything JS can touch. Delivering silky-smooth performance and unmatched support so you can focus on the fun stuff.</p>
                            <button onClick={() => {
                                loginref.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }} className="w-40 h-20 rounded-full border-heading border-2 text-lg transition-all duration-300 hover:bg-heading hover:text-background">GET STARTED</button>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 3 }}
                            >
                                <Lottie
                                    animationData={arrow}
                                    className={`size-44 relative bottom-12 ${inview ? "opacity-0 transition-all duration-500" : ""} ml-auto mt-auto`}
                                    loop={true}
                                />
                            </motion.div>
                        </div>
                        <div className="w-[35%] h-full flex justify-center items-center">
                            <div className="overflow-hidden">
                                <motion.img className="w-[350px]" src={ani} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} alt="" />
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="w-full h-[100vh] bg-background flex flex-col gap-8 pl-32 pt-20">
                    <p className="text-text1 text-6xl">
                        {'{ About Us }'}
                    </p>
                    <div>
                        <p ref={aboutref} className="text-heading text-4xl leading-loose">Welcome to Anim-It, your gateway to effortless 2D animation creation! Designed with beginners in mind, Anim-It combines user-friendliness with cutting-edge technology. Our integration of generative AI ensures stunning visuals without taxing your hardware. Dive into a world where creativity knows no bounds. Whether you're a novice or a seasoned animator, Anim-It empowers you to bring your imagination to life with ease. Start animating today with Anim-It!</p>
                        <p className="text-heading text-4xl leading-loose">
                            Within Anim-It, a team of computer science students, driven by passion, is committed to reshaping animation accessibility through innovation and expertise.
                        </p>
                    </div>
                </div>
                <Feature featureref={featureref} featureinview={featureinview} /> 
                {showLogin ? (
                    <Login loginref={loginref} logfocus={logfocus} setShowLogin={setShowLogin} setLogfocus={setLogfocus} />
                ) : (
                    <SignUp loginref={loginref} logfocus={logfocus} setLogfocus={setLogfocus} setShowLogin={setShowLogin} />
                )}

            </div>
            <div className="flex w-[5%] fixed h-full bg-background justify-center items-center  flex-col gap-4 p-4">
                <motion.div onClick={() => { homeref.current?.scrollIntoView({ behavior: "smooth" }) }} whileHover={{ scale: 1.2 }} className={`w-4 h-4 rounded-full transition-all duration-300 bg-heading  ${homeinview ? "opacity-90" : "opacity-20"}`}></motion.div>
                <motion.div onClick={() => { aboutref.current?.scrollIntoView({ behavior: "smooth" }) }} whileHover={{ scale: 1.2 }} className={`w-4 h-4 rounded-full transition-all duration-300 bg-heading  ${aboutinview ? "opacity-90" : "opacity-20"}`}></motion.div>
                <motion.div onClick={() => { featureref.current?.scrollIntoView({ behavior: "smooth" }) }} whileHover={{ scale: 1.2 }} className={`w-4 h-4 rounded-full transition-all duration-300 bg-heading  ${featureinview ? "opacity-90" : "opacity-20"}`}></motion.div>
                <motion.div onClick={() => { loginref.current?.scrollIntoView({ behavior: "smooth" }) }} whileHover={{ scale: 1.2 }} className={`w-4 h-4 rounded-full transition-all duration-300 bg-heading  ${logininview ? "opacity-90" : "opacity-20"}`}></motion.div>
            </div>
        </div>
    )
}
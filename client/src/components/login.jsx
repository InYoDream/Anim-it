import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ loginref, logfocus, setLogfocus, setShowLogin }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const json = await response.json();
        console.log(json);
        if (json) {
            localStorage.setItem('token', json.authToken);
            navigate("/dash");
        }
        else {
            alert("Invalid credentials entered .");
        }
    }




    return (
        <div ref={loginref} className="w-full h-[100vh] relative bg-background ">
            <div className="absolute  w-full h-full pt-32 pl-24 opacity-30 flex justify-between pr-8 items-center">
                <div>
                    <svg width="355" height="586" viewBox="0 0 355 586" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M171.5 201C171.5 204.558 168.399 207.5 164.5 207.5C160.601 207.5 157.5 204.558 157.5 201C157.5 197.442 160.601 194.5 164.5 194.5C168.399 194.5 171.5 197.442 171.5 201Z" stroke="#FFFCE1" />
                        <circle cx="160" cy="106" r="48" stroke="#FFFCE1" stroke-width="4" />
                        <path d="M162.5 155.5C160 170 181.5 330.5 162.5 433.5M162.5 433.5C133.5 469 78.6 548.8 91 584M162.5 433.5C208 475 289.5 563.2 251.5 584" stroke="#FFFCE1" stroke-width="3" />
                        <path d="M168.5 255.5C195.667 269.833 247.4 241.5 237 13.5" stroke="#FFFCE1" stroke-width="3" />
                        <path d="M169.5 259C136.333 290.5 70.7 304.4 73.5 108" stroke="#FFFCE1" stroke-width="3" />
                        <path d="M157.5 201C115.833 240.333 26.7 349.6 3.5 472C8.3 448 41.8333 458.667 58 467C83.5 483.667 132.5 505.2 124.5 458C116.5 410.8 161.5 420.667 185 431.5C206.667 461.5 252.6 508.8 263 458C273.4 407.2 323 446.167 346.5 472C383.3 414 246.167 267.167 173 201" stroke="#FFFCE1" stroke-width="3" />
                        <circle cx="76" cy="103" r="9.5" stroke="#FFFCE1" />
                        <g filter="url(#filter0_d_2_44)">
                            <circle cx="238" cy="10" r="9.5" stroke="#FFFCE1" shape-rendering="crispEdges" />
                        </g>
                        <path d="M12 521.5C10 547.5 4.5 564.667 2 570" stroke="#FFFCE1" stroke-width="3" />
                        <path d="M59.5 519C53.5 544.2 57 561.5 59.5 567" stroke="#FFFCE1" stroke-width="3" />
                        <path d="M275 508L283 540V552.5M318 502L335.5 535.5" stroke="#FFFCE1" stroke-width="3" />
                        <defs>
                            <filter id="filter0_d_2_44" x="224" y="0" width="28" height="28" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_44" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_44" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </div>

                <div>
                    <svg width="500" height="357" viewBox="0 0 595 357" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="543" cy="52" r="48" stroke="#FFFCE1" stroke-width="4" />
                        <path d="M492.235 69.1467C448.578 90.3484 412.63 110.135 383.182 128.264M224.106 355C434.207 270.203 335.993 245.487 260.624 243.728C260.65 242.612 260.809 241.374 261.114 240.015M261.114 240.015C180.745 262.036 16.4069 315.863 2 355M261.114 240.015C265.168 221.917 295.076 182.508 383.182 128.264M383.182 128.264C131.462 111.282 326.655 37.0122 455.717 2M383.182 128.264C469.724 149.326 631.201 209.867 584.779 283.537" stroke="#FFFCE1" stroke-width="4" />
                        <path d="M237 24.5H166M156.5 218C209.7 218 232.333 211.667 237 208.5M28 155C79.2 155 104.667 155 111 155M73 108C127.4 110.8 151.333 109.167 156.5 108" stroke="#FFFCE1" stroke-width="3" />
                        <path d="M10.5 66C142.5 60.4 127.833 57.3333 104 56.5" stroke="#FFFCE1" stroke-width="3" />
                    </svg>

                </div>

            </div>
            <div className="w-full h-full z-50 flex flex-col items-center justify-center" >
                <motion.div className={`relative ${logfocus? "top-36" : "top-60"} transition-all z-50 duration-500`}
                >
                <svg width="232" height="180" viewBox="0 0 232 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="116.5" cy="50.5" r="48" stroke="#FFFCE1" stroke-width="5" />
                    <path d="M103 39C103 43.4729 99.5891 47 95.5 47C91.4109 47 88 43.4729 88 39C88 34.5271 91.4109 31 95.5 31C99.5891 31 103 34.5271 103 39Z" fill="#FFFCE1" stroke="#FFFCE1" stroke-width="2" />
                    <path d="M139 39C139 43.4729 135.589 47 131.5 47C127.411 47 124 43.4729 124 39C124 34.5271 127.411 31 131.5 31C135.589 31 139 34.5271 139 39Z" fill="#FFFCE1" stroke="#FFFCE1" stroke-width="2" />
                    <line x1="118.5" y1="101" x2="118.5" y2="258" stroke="#FFFCE1" stroke-width="5" />
                    <line x1="118.015" y1="259.48" x2="60.0152" y2="338.48" stroke="#FFFCE1" stroke-width="5" />
                    <line x1="117.79" y1="256.255" x2="194.79" y2="335.255" stroke="#FFFCE1" stroke-width="5" />
                    <path d="M116 167C153 191 227.5 202.2 229.5 55" stroke="#FFFCE1" stroke-width="5" />
                    <path d="M116 166.692C79.163 190.627 4.99119 201.796 3 55" stroke="#FFFCE1" stroke-width="5" />
                </svg>

            </motion.div>

            <div className="w-[30%] z-50 h-[60%] gap-4 border-border border-2 rounded-xl bg-background flex flex-col items-center " onClick={() => { setLogfocus(true) }}>
                <div className="w-full h-full flex items-center flex-col gap-8 pt-8">
                    <p className="text-heading font-bold text-5xl font-pt">Login</p>
                    <div className="w-full flex items-center flex-col ">
                        <p className="text-heading mr-auto pl-16 font-bold">
                            Email
                            <span className="text-red-500 ml-2">*</span>
                        </p>
                        <input type="text" className="p-4 text-heading bg-border font-bold rounded-lg w-[80%]" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="w-full flex items-center flex-col">
                        <p className="text-heading mr-auto pl-16 font-bold">
                            Password
                            <span className="text-red-500 ml-2">*</span>
                        </p>
                        <input type="password" className=" p-4 text-heading bg-border font-bold rounded-lg w-[80%]" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSubmit} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Login</button>
                    <button className="text-blue-500" onClick={() => { setShowLogin(false) }}>
                        New to Anim-it ? Register
                    </button>
                </div>
            </div>
            )
        </div>
        </div >
    );
}
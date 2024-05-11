import React from "react";
// import Image from "next/image";
import { AiOutlineMessage } from "react-icons/ai";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiHeart, CiMoneyBill } from "react-icons/ci";
import { CiSaveDown2 } from "react-icons/ci";
import { FaMoneyBillWave } from "react-icons/fa6";
// import { } from "@/gql/graphql";

// interface FeedCardProps {
//   data: Tweet;
// }

const FeedCard= (props) => {
    const { data } = props;
    return (
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 hover:bg-slate-900 transition-all p-5">
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                    {" "}
                </div>
                <div className="col-span-11">
                    <h5>Abhishek Kothiyal</h5>
                    <p>
                        jfsjjkjkldsshdf hjkh jkhgjkghjkshsjkhlhg hjkhghjkhgjkgfdjk hjkhhjkhsjkdghjkhfjkdh jkhhjkhjksadghjkhs djkhjkhjkgrhjkh
                        hfdshjksfdhjk gh
                    </p>
                    <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
                        <div className="cursor-pointer">
                            <AiOutlineMessage />
                        </div>
                        <div className="cursor-pointer">
                            <AiOutlineRetweet />
                        </div>
                        <div className="cursor-pointer">
                            <CiHeart />
                        </div>
                        <div className="cursor-pointer">
                            <CiSaveDown2 />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedCard;

// import Image from "next/image";
import { IoMdHome } from "react-icons/io";
import { BsThreads } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import FeedCard from "./Feedcard";
//import { FaMoneyBillWave } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";
import { useCallback } from "react";
// import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import toast from "react-hot-toast";
// import graphqlClient from "@/clients/api";
// import {verifyUserGoogleTokenQ} from "@/graphql/query/user";
import { GrGallery } from "react-icons/gr";
// import { useQueryClient } from "@tanstack/react-query";
// import { useCurrentUser } from "@/hooks/user";
// import { useGetAllTweets } from "@/hooks/tweet";

interface SideBarButton {
  title: string;
  icon: React.ReactNode;
}

const handleSelectImage = ()=>{
  const input=document.createElement("input");
  input.setAttribute("type","file");
  input.setAttribute("accept","image/*");
  input.click();
};

const sideBarItems: SideBarButton[] = [
  {
    title: "Home",
    icon: <IoMdHome />,
  },
  {
    title: "Explore",
    icon: <FaHashtag />,
  },
  {
    title: "Notifications",
    icon: <FaBell />,
  },
  {
    title: "Messages",
    icon: <FaEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <FaBookmark />,
  },
  {
    title: "Monetization",
    icon: <CiMoneyBill />,
  },
  {
    title: "Profile",
    icon: <CgProfile />,
  },
];

export default function Home() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const {tweets=[]} = useGetAllTweets();
  console.log(user);
  const handleLoginwithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found.`);
      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQ,
        {
          token: googleToken,
        }
      );
      toast.success(`Verified success`);
      console.log(verifyGoogleToken);
      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1 px-3 relative">
          <div className="text-4xl h-fit w-fit hover:bg-slate-600 rounded-full p-2 cursor-pointer transition-all">
            <BsThreads />
          </div>
          <div className="font-semibold mt-4 text-2xl">
            <div className="mt-4 text-xl font-bold">
              {sideBarItems.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 rounded-full px-5 py-2 w-fit cursor-pointer hover:bg-slate-600 mt-2"
                  key={item.title}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </div>
            <button className="bg-[#1d9bf0] text-lg rounded-full w-full mt-4 p-4">
              Post
            </button>
          </div>
        </div>
        <div className="mt-5 absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
          {user && user.profileImageURL && (
            <Image
              className="rounded-full "
              src={user?.profileImageURL}
              alt="user-image"
              height={50}
              width={50}
            />
          )}
          <div>
            <h3 className="text-xl">
              {user?.firstName} {user?.lastName}
            </h3>
          </div>
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] border-slate-600">
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 hover:bg-slate-900 transition-all p-5">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                <div className="mt-2 text-xl flex justify-between items-center">
                  {/* <div onClick={handleSelectImage}><GrGallery /></div> */}
                  <GrGallery onClick={handleSelectImage} className="cursor-pointer"/>  
                  <button className="rounded-full font-semibold bg-[#1d9bf0] py-1 px-4 text-sm">
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg ">
              <h1 className="my-2 text-2xl">New Here ?</h1>
              <GoogleLogin onSuccess={handleLoginwithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

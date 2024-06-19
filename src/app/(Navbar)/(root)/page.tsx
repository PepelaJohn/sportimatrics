"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Suspense, useRef, useState } from "react";
import Image1 from "@/public/img/small/drake.jpg";
import Image2 from "@/public/img/small/riri.jpg";
import Image3 from "@/public/img/small/gunna.jpg";
import { StaticImageData } from "next/image";
import { IoIosArrowUp } from "react-icons/io";
import { useDispatch } from "react-redux";
import { LoginUser } from "@/redux/actions/user";
import { AppDispatch } from "@/redux/store/StoreProvider";
import Alert from "@/components/Alert";
gsap.registerPlugin(useGSAP);

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleCreateUser = () => {
    dispatch(LoginUser);
    console.log("done");
  };
  const images: StaticImageData[] = [Image1, Image2, Image3];
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.to(".border-bottom", {
      delay: 1.4,
      width: "100%",
      ease: "expo.inOut",
    });

    gsap.from(".subtitle", {
      delay: 2.8,
      opacity: 0,
      x: -20,
      ease: "expo.inOut",
    });

    gsap.to(".title", {
      delay: 2.2,
      width: "100%",
      ease: "expo.inOut",
    });

    gsap.from(".desc", {
      delay: 2.8,
      opacity: 0,
      x: -20,
      ease: "expo.inOut",
    });

    gsap.from(".readmore", {
      delay: 2.8,
      opacity: 0,
      x: -20,
      ease: "expo.inOut",
    });

    gsap.to(".img-item", {
      delay: 2.2,
      width: "100%",
      ease: "expo.inOut",
      stagger: 0.2,
    });

    gsap.from(".item-4", {
      opacity: 0,
      x: -20,
      delay: 3,
      ease: "expo.inOut",
    });

    gsap.to(".first", {
      delay: 0.2,
      left: "-100%",
      ease: "expo.inOut",
    });

    gsap.to(".second", {
      delay: 0.4,
      left: "-100%",
      ease: "expo.inOut",
    });

    gsap.to(".third", {
      delay: 0.6,
      left: "-100%",
      ease: "expo.inOut",
    });
  });

  return (
    <section className="w-full max-h-[100vh] h-full   overflow-x-hidden text-white-1 !overflow-hidden !max-w-[100vw]">
      <div className="overlay first"></div>
      <div className="overlay second"></div>
      <div className="overlay third"></div>
      <div className="wrapper absolute top-0 left-0 right-0 h-[100px]">
        <div className="nav"></div>
      </div>
      <hr className="border-bottom" />

      <Suspense fallback={<LoaderSpinner />}>
        <div className="content  items-center justify-center h-full   flex px-5">
          <div className="mx-width flex h-full items-center w-full max-lg:flex-col">
            <div className="text  md:h-full md:pr-20 items-center max-md:items-start max-md:justify-start max-md:mt-[130px] justify-center flex-col flex max-md:mb-10 md:flex-1">
              <div className="">
                <p className="subtitle text-[#ffffff80] text-xs max-md:text-[10px] uppercase">
                  your stats
                </p>
                <h1 className="title max-[540px]:text-2xl  max-md:text-3xl max-xl:text-[60px] text-[70px] font-semibold uppercase w-0 whitespace-nowrap">
                  SPOTIMETRICS
                </h1>
                <p className="desc max-md:text-sm max-[540px]:text-xs">
                  Track all your listening data <br />
                  <span className="readmore md:my-1 cursor-pointer">
                    Listen to all your music
                  </span>
                  <br />
                  All in one place!!
                </p>

                <a
                  href="#"
                  className="readmore mt-10 max-md:mt-4 max-[540px]:mt-2 max-[540px]:text-xs max-md:text-sm"
                >
                  START
                </a>
              </div>
              {/* <button
                onClick={() => handleCreateUser()}
                className="bg-green-400 h-8 px-3"
              >
                CLICK ME
              </button> */}
            </div>

            <div className="relative  grid-container w-full z-10 md:pt-[100px]  flex-shrink-0  h-full flex-1 ">
              <div className="item-4 flex max-w-full overflow-hidden flex-grow-0 w-full items-end justify-end ">
                <div className="flex items-center gap-2">
                  <IoIosArrowUp className="text-xs" />
                  <p className="text-gray-600 text-xs font-extralight">Drake</p>
                </div>
              </div>
              {images.map((image, i) => (
                <div
                  key={i}
                  style={{ backgroundImage: `url(${image.src})` }}
                  className={`item-${
                    i + 1
                  } easeinOut hover:scale-105 cursor-pointer img-item w-full max-w-full h-full `}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default Home;

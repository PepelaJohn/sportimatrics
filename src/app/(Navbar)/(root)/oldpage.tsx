"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Suspense, useEffect, useState } from "react";
// import { IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store/StoreProvider";
import Link from "next/link";
import { getuserTopItems } from "@/api";
gsap.registerPlugin(useGSAP);

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: any) => state.user);
  const loggedIn = !!Object.keys(user).length;

  const [loading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [topArtists, settopArtists] = useState<IArtist[] | []>([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const promiseData: any = await getuserTopItems(
        "artists",
        "long_term",
        dispatch as React.Dispatch<UnknownAction>,
        3,
        0
      );

      if (!!promiseData) {
        settopArtists(promiseData);
      }
      setLoading(false);
    };
    getData();
  }, [refresh]);

  useGSAP(() => {
    window.document.querySelector(".border-bottom") &&
      gsap.to(".border-bottom", {
        delay: 1.4,
        width: "100%",
        ease: "expo.inOut",
      });

    window.document.querySelector(".subtitle") &&
      gsap.from(".subtitle", {
        delay: 2.8,
        opacity: 0,
        x: -20,
        ease: "expo.inOut",
      });

    window.document.querySelector(".title") &&
      gsap.to(".title", {
        delay: 2.2,
        width: "100%",
        ease: "expo.inOut",
      });

    window.document.querySelector(".desc") &&
      gsap.from(".desc", {
        delay: 2.8,
        opacity: 0,
        x: -20,
        ease: "expo.inOut",
      });

    window.document.querySelector(".readmore") &&
      gsap.from(".readmore", {
        delay: 2.8,
        opacity: 0,
        x: -20,
        ease: "expo.inOut",
      });

    window.document.querySelector(".img-item") &&
      gsap.to(".img-item", {
        delay: 2.2,
        width: "100%",
        ease: "expo.inOut",
        stagger: 0.2,
      });

    window.document.querySelector(".item-4") &&
      gsap.from(".item-4", {
        opacity: 0,
        x: -20,
        delay: 3,
        ease: "expo.inOut",
      });

    window.document.querySelector(".first") &&
      gsap.to(".first", {
        delay: 0.2,
        left: "-100%",
        ease: "expo.inOut",
      });

    window.document.querySelector(".second") &&
      gsap.to(".second", {
        delay: 0.4,
        left: "-100%",
        ease: "expo.inOut",
      });

    window.document.querySelector(".third") &&
      gsap.to(".third", {
        delay: 0.6,
        left: "-100%",
        ease: "expo.inOut",
      });
  });

  return (
    <section className="w-full max-h-[100vh]   overflow-x-hidden text-white-1 !overflow-hidden !max-w-[100vw]">
      <div className="overlay first"></div>
      <div className="overlay second"></div>
      <div className="overlay third"></div>
      <span className="fixed top-[100px] w-full left-0 right-0">
        <hr className=" " />
      </span>

      <Suspense fallback={<LoaderSpinner />}>
        <div className="content  items-center justify-center h-full  nav-height flex-col flex px-5">
          <div className="mx-width flex h-f items-center w-full max-lg:flex-col">
            <div className="text easeinOut md:h-full md:pr-20 items-center max-md:items-start max-md:justify-start max-md:mt-[130px] justify-center flex-col flex max-md:mb-10 md:flex-1">
              <div className="">
                <p className="subtitle text-[#ffffff80] text-xs max-md:text-[10px] uppercase">
                  your stats
                </p>
                <h1 className="title max-[540px]:text-2xl  max-md:text-3xl max-xl:text-[60px] text-[70px] font-semibold uppercase w-0 whitespace-nowrap">
                  MUSIMETER
                </h1>
                <p className="desc max-md:text-sm max-[540px]:text-xs">
                  Uncover Your Listening Stats <br />
                  <span className=" md:my-1 cursor-pointer">
                    Relive Your Music Moments
                  </span>
                  <br />
                  Explore Your Personalized Music Journey!!
                </p>

                {!loggedIn && (
                  <Link
                    href="/auth"
                    className="readmore mt-10 max-md:mt-4 max-[540px]:mt-2 max-[540px]:text-xs max-md:text-sm"
                  >
                    START EXPLORING
                  </Link>
                )}
              </div>
            </div>

            <div className="relative  grid-container w-full z-10    flex-shrink-0  h-full flex-1 ">
              {loggedIn ? (
                <>
                  {loading ? (
                    <LoaderSpinner></LoaderSpinner>
                  ) : (
                    <>
                      {" "}
                      <div className="item-4 flex max-w-full overflow-hidden flex-grow-0 w-full items-end justify-end ">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 text-xs font-extralight">
                            {!!topArtists?.length && (
                              <span className="text-gray-200">1. </span>
                            )}
                            {!!topArtists.length && topArtists[0]?.name}
                          </p>
                        </div>
                      </div>
                      {!!topArtists?.length ? (
                        topArtists?.map((artist, i) => (
                          <Link
                            href={"/top-artists?range=long_term"}
                            key={i}
                            style={{
                              backgroundImage: `url(${artist.images[1].url})`,
                            }}
                            className={`item-${
                              i + 1
                            } easeinOut hover:scale-105 border-green-300 border cursor-pointer img-item w-full min-w-full max-w-full h-full `}
                          ></Link>
                        ))
                      ) : (
                        <div className="text-white-1 !h-full w-full items-center item-1  flex justify-center text-sm">
                          <button
                            onClick={() => setRefresh((prev) => !prev)}
                            type="button"
                            className="buttonrefresh"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-arrow-repeat"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
                              <path
                                fill-rule="evenodd"
                                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                              ></path>
                            </svg>
                            Refresh
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="text-white-1 !h-full w-full items-center item-1  flex justify-center text-sm">
                    <Link
                      className="bg-green-400 px-5 py-1 text-sm uppercase"
                      href={"/auth"}
                    >
                      Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default Home;

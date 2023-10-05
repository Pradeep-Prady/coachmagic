import * as React from "react";

const Testimonials = () => {
  return (
    <div className="flex flex-col py-10 -ml-[60px]">
      <div className="text-[40px] ml-center ml-[90px]">
        <p>
          Community{" "}
          <span className="animate-pulse bg-gradient-to-r from-blue-600 via-red-500 to-indigo-400 inline-block text-transparent bg-clip-text">
            Query
          </span>
        </p>
      </div>

      <div className="h-[800px] overflow-y-auto mr-8">
        <section className="">
          <div className="mx-auto max-w-[1100px]">
            <div className="grid grid-cols-1 lg:items-center lg:gap-16 ">
              <div>
                <div id="keen-slider" className="keen-slider ">
                  <div className="py-5 keen-slider__slide">
                    <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12  border-2 border-blue-600 rounded-3xl">
                      <div>
                        <div className="mt-4 flex flex-row">
                          <div>
                            <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                              Nekelash
                            </p>

                            <p>nekelash@gmail.com</p>
                            <p>Devops</p>
                          </div>
                          <div className="flex flex-row px-3">
                            <div className="px-2">
                              <button className="bg-black text-white px-3 py-2 rounded-md">
                                Accept
                              </button>
                            </div>
                            <div className="px-2">
                              <button className="border-black border-2 px-3 py-2 rounded-md">
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 leading-relaxed text-gray-700">
                          No, Rose, they are not breathing. And they have no
                          arms or legs … Where are they? You know what? If we
                          come across somebody with no arms or legs, do we
                          bother resuscitating them? I mean, what quality of
                          life do we have there?
                        </p>
                      </div>

                      <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                        <span className="animate-pulse bg-gradient-to-r from-red-600 via-red-600 to-red-600 inline-block text-transparent bg-clip-text">
                          URGENT
                        </span>
                      </footer>
                    </blockquote>
                  </div>
                  <div className="py-5 keen-slider__slide">
                    <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12  border-2 border-blue-600 rounded-3xl">
                      <div>
                        <div className="mt-4 flex flex-row">
                          <div>
                            <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                              Nekelash
                            </p>

                            <p>nekelash@gmail.com</p>
                            <p>Devops</p>
                          </div>
                          <div className="flex flex-row px-3">
                            <div className="px-2">
                              <button className="bg-black text-white px-3 py-2 rounded-md">
                                Accept
                              </button>
                            </div>
                            <div className="px-2">
                              <button className="border-black border-2 px-3 py-2 rounded-md">
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 leading-relaxed text-gray-700">
                          No, Rose, they are not breathing. And they have no
                          arms or legs … Where are they? You know what? If we
                          come across somebody with no arms or legs, do we
                          bother resuscitating them? I mean, what quality of
                          life do we have there?
                        </p>
                      </div>

                      <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                        {/* <span className="animate-pulse bg-gradient-to-r from-red-600 via-red-600 to-red-600 inline-block text-transparent bg-clip-text">
                        URGENT
                      </span> */}
                      </footer>
                    </blockquote>
                  </div>
                  <div className="py-5 keen-slider__slide">
                    <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12  border-2 border-blue-600 rounded-3xl">
                      <div>
                        <div className="mt-4 flex flex-row">
                          <div>
                            <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                              Kamalesh
                            </p>

                            <p>nekelash@gmail.com</p>
                            <p>Devops</p>
                          </div>
                          <div className="flex flex-row px-3">
                            <div className="px-2">
                              <button className="bg-black text-white px-3 py-2 rounded-md">
                                Accept
                              </button>
                            </div>
                            <div className="px-2">
                              <button className="border-black border-2 px-3 py-2 rounded-md">
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 leading-relaxed text-gray-700">
                          No, Rose, they are not breathing. And they have no
                          arms or legs … Where are they? You know what? If we
                          come across somebody with no arms or legs, do we
                          bother resuscitating them? I mean, what quality of
                          life do we have there?
                        </p>
                      </div>

                      <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                        <span className="animate-pulse bg-gradient-to-r from-red-600 via-red-600 to-red-600 inline-block text-transparent bg-clip-text">
                          URGENT
                        </span>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Testimonials;

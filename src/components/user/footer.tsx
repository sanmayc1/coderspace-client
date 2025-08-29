import MotionScrollWrap from "../common/reuseable/motion-scroll-wraper";

const Footer = () => {
  return (
    <>
      <MotionScrollWrap>
        <footer className="w-full bg-black flex flex-col text-white font-[anybody-regular]">
          <div className="grow p-10 flex justify-between  md:flex-row flex-col md:gap-0 gap-10">
            <div className="flex gap-40 px-10 ">
              <div>
                <h3 className="text-lg font-bold ">Explore</h3>
                <ul className="flex flex-col gap-5 text-gray-400 select-none text-sm pt-5">
                  <li className="hover:text-white ">Problems</li>
                  <li className="hover:text-white ">contest</li>
                  <li className="hover:text-white ">Problems</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold">Connect</h3>
                <ul className="flex flex-col gap-5 text-gray-400 select-none text-sm pt-5">
                  <li className="hover:text-white ">GitHub</li>
                  <li className="hover:text-white ">LinkedIn</li>
                  <li className="hover:text-white ">Instagram</li>
                </ul>
              </div>
            </div>
            <div className="px-10">
              <h3 className="text-lg font-bold  pb-5">Connect</h3>
              <a
                className="hover:text-white text-gray-400 text-sm"
                href="mailto:sanmayc9@gmail.com"
              >
                coderspace.support@gmail.com
              </a>
            </div>
          </div>
          <p className="text-center text-gray-300 text-xs py-5  ">
            © 2025 CoderSpace. All rights reserved.
          </p>
        </footer>
      </MotionScrollWrap>
    </>
  );
};

export default Footer;

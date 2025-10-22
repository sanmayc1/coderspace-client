import type { ISectionProps } from "@/types/props.types";
import MotionScrollWrap from "./MotionScrollWraper";
import { ChevronRight } from "lucide-react";

const Section: React.FC<ISectionProps> = ({
  reverse = false,
  bannerUrl,
  description,
  exploreUrl,
  head,
}) => {
  return (
    <>
      <MotionScrollWrap>
        <section
          className={`grid sm:grid-cols-2 grid-cols-1 px-20 ${
            reverse ? "md:gap-32" : ""
          }`}
        >
          <div
            className={`${
              reverse ? "md:order-2" : "order-1"
            } flex flex-col gap-9 justify-center`}
          >
            <h3 className="font-[anybody-bold] text-3xl ">{head}</h3>
            <p className="font-[anybody-light] text-gray-800 text- font-light text-left">
              {description.split(" ").slice(0, 9).join(" ")}
              <br /> {description.split(" ").slice(9, 18).join(" ")}
              <br />
              {description
                .split(" ")
                .slice(18, description.length - 1)
                .join(" ")}
            </p>
            <p className="flex gap-2 items-center text-gray-800 font-semibold cursor-pointer">
              Expolore More <ChevronRight size={15} />
            </p>
          </div>
          <div
            className={`${
              reverse ? "md:order-1" : "order-2"
            } flex justify-center items-center`}
          >
            <img
              src={`${bannerUrl}`}
              alt="banner"
              className="max-w-[85%] min-w-99 "
            />
          </div>
        </section>
      </MotionScrollWrap>
    </>
  );
};

export default Section;

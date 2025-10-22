import Section from "@/components/common/Section";
import HeroSection from "@/components/user/HeroSection";
import { sectionData } from "@/utils/constants";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <div className="flex flex-col gap-40">
        {sectionData.map((data) => (
          <Section key={data.head} {...data} />
        ))}
      </div>
    </>
  );
};

export default Home;

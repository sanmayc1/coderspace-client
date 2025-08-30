import Section from "@/components/common/section"
import HeroSection from "@/components/user/hero-section"
import { sectionData } from "@/utils/constants"



const Home:React.FC =()=>{
    return (
        <>
        <HeroSection/>
        <div className="flex flex-col gap-40">
            {
                sectionData.map((data)=><Section key={data.head} {...data}/>)
            }
        </div>
        </>
    )
}

export default Home
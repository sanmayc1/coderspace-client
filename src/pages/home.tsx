import Section from "@/components/common/reuseable/section"
import HeroSection from "@/components/user/hero-section"
import { sectionData } from "@/utils/constants"



const Home =()=>{
    return (
        <>
        <HeroSection/>
        <div className="flex flex-col gap-40">
            {
                sectionData.map((data)=><Section {...data}/>)
            }
        </div>
        </>
    )
}

export default Home
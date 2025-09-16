import { companyMenuItems } from "@/utils/constants"
import CommonLayout from "./common-layout"




const CompanyLayout:React.FC = ()=>{
    return (
        <>
           <CommonLayout menuItems={companyMenuItems}/>
        </>
    )
}

export default CompanyLayout
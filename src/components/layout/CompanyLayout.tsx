import { companyMenuItems } from "@/utils/constants"
import CommonLayout from "./CommonLayout"




const CompanyLayout:React.FC = ()=>{
    return (
        <>
           <CommonLayout menuItems={companyMenuItems} profileNavigate="/company/profile"/>
        </>
    )
}

export default CompanyLayout
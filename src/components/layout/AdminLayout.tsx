
import { adminMenuItems } from "@/utils/constants";
import CommonLayout from "./CommonLayout";
const AdminLayout: React.FC = () => {
 return (
  <CommonLayout menuItems={adminMenuItems} profileNavigate="/admin/profile"/>
 )
};

export default AdminLayout;



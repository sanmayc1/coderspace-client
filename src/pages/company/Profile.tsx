import { getComapny } from "@/api/company/company";
import LoadingSpin from "@/components/common/LoadingSpin";
import type { IGetCompanyResponse } from "@/types/response.types";
import { Building2, FileText, Mail} from "lucide-react";
import { useEffect, useState } from "react";

const CompanyProfile = () => {
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await getComapny();
        setCompanyData(company);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompany();
  }, []);

  const [companyData, setCompanyData] = useState<IGetCompanyResponse | null>(
    null
  );

  if (!companyData) {
    return (
      <div className=" flex justify-center items-center h-96">
        <LoadingSpin size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100  sm:p-6">
        <div className="mx-auto">
          <div className="bg-white  rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6">
            <div className="px-4 pt-2 sm:px-6 md:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 md:space-x-6 ">
                <div className="relative">
                  <img
                    src={companyData?.profileUrl || "/building.png"}
                    alt={companyData?.companyName}
                    className="w-24 h-24 rounded-xl sm:rounded-2xl border-4 border-white shadow-xl object-cover"
                  />
                </div>

                {/* Company Name */}
                <div className="mt-3 sm:mt-0 sm:mb-4 flex flex-col justify-start items-start">
                  <h1 className="text-2xl sm:text-3xl  font-bold text-slate-900 break-words">
                    {companyData?.companyName}
                  </h1>
                  <p className="text-sm  text-slate-600 mt-1">
                    Corporate Profile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 sm:mb-6">
              Company Details
            </h2>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs  font-medium text-slate-500 mb-1">
                    Email Address
                  </div>
                  <a
                    href={`mailto:${companyData?.email}`}
                    className="text-sm  text-slate-900 font-medium hover:text-blue-600 transition-colors break-all"
                  >
                    {companyData?.email}
                  </a>
                </div>
              </div>

              {/* GST Number */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    GST Number
                  </div>
                  <div className="text-sm  text-slate-900 font-medium font-mono break-all">
                    {companyData?.gstin}
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs  font-medium text-slate-500 mb-1">
                    Registered Name
                  </div>
                  <div className="text-sm  text-slate-900 font-medium break-words">
                    {companyData?.companyName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;

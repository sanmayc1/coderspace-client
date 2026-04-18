import React, { useEffect, useState } from 'react';
import { Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { IGetAllPlansResponse } from '@/types/response.types';
import EditPlanModal from '@/components/admin/plans/EditPlanModal';
import { getAllPlansAdmin } from '@/api/admin/payment-management';

const ListAllPlans: React.FC = () => {
  const [plans, setPlans] = useState<IGetAllPlansResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IGetAllPlansResponse | null>(null);

  useEffect(() => {
    async function fetchAllPlans() {
      try {
        setIsLoading(true);
        const plansData = await getAllPlansAdmin();

        setPlans(plansData as IGetAllPlansResponse[]);
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllPlans();
  }, []);

  const handleEditClick = (plan: IGetAllPlansResponse) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-['anybody-regular'] min-h-[80vh]">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-2">
            Manage Subscription Plans
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            View and edit the subscription plans available to users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading
            ? // Skeleton Loading
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="relative rounded-xl p-5 border border-gray-200 bg-white flex flex-col animate-pulse"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="mb-4 mt-2">
                    {/* Removed Icon placeholder */}
                    <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>

                  <div className="mb-4">
                    <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
                  </div>

                  <div className="flex-grow space-y-3 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0"></div>
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative rounded-xl p-5 border border-gray-200 bg-white hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                >
                  {/* Edit Button */}
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      onClick={() => handleEditClick(plan)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mb-4 mt-2">
                    {/* Icon section removed as requested */}
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="mt-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <span className="text-xs text-gray-600 leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        plan={selectedPlan}
        setPlans={setPlans}
      />
    </div>
  );
};

export default ListAllPlans;

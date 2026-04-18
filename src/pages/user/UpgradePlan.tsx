import React, { useEffect, useState } from 'react';
import { Check, Zap, Crown, type LucideProps } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  createRazorpayOrder,
  getAllPlans,
  markPaymentFailed,
  verifyRazorpayOrder,
} from '@/api/user/user.payments';
import type { IGetAllPlansResponse } from '@/types/response.types';
import { useNavigate } from 'react-router-dom';
import { loadRazorpay } from '@/utils/helper';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';

const basicPlan: IPlansState = {
  id: 'basic',
  name: 'Basic',
  icon: Zap,
  description: 'Essential features for getting started',
  price: 0,
  features: [
    'Access to basic problems',
    'Standard compiler',
    'Community support',
    'Limited successful submissions',
  ],
  color: 'bg-gray-100',
  duration: '0',
  popular: false,
};

interface IPlansState extends IGetAllPlansResponse {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  popular: boolean;
}

const UpgradePlan: React.FC = () => {
  const [plans, setPlans] = useState<IPlansState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllPlans() {
      try {
        setIsLoading(true);
        // Simulate a small delay if needed to show skeleton, or just fetch
        const plans = await getAllPlans();
        console.log(plans);

        setPlans([
          basicPlan,
          ...(plans.map((plan, i) => ({
            ...plan,
            icon: Crown,
            color: 'bg-orange-50 border-orange-200',
            popular: i % 2 === 0,
          })) as IPlansState[]),
        ]);
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (planId === 'basic') {
      navigate('/problems');
      return;
    }

    loadRazorpay();
    try {
      const order = await createRazorpayOrder(planId);
      let failed = false;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Coderspace',
        description: 'Premium Subscription',
        order_id: order.orderId,
        prefill: {
          name: order.name,
          email: order.email,
        },
        handler: async function (response: any) {
          try {
            const verifyOrder = await verifyRazorpayOrder(response);
            if (verifyOrder.success) {
              toast.success('Payment Successfull', toastifyOptionsCenter);

              navigate('/user');
              window.location.reload();
            }
          } catch (error) {
            toast.error('Something went wrong', toastifyOptionsCenter);
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              if (!failed) {
                await markPaymentFailed(order.orderId);
                return;
              }
              toast.error('Payment Failed', toastifyOptionsCenter);
            } catch (error) {
              toast.error('Something went wrong', toastifyOptionsCenter);
            }
          },
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', async function () {
        try {
          await markPaymentFailed(order.orderId);
          failed = true;
        } catch (error) {
          toast.error('Something went wrong', toastifyOptionsCenter);
        }
      });
    } catch (error) {
      toast.error('Something went wrong', toastifyOptionsCenter);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-['anybody-regular']">
      <div className="max-w-5xl w-full mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-2">
            Upgrade Your Coding Journey
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Unlock premium features, get unlimited access to problems, and accelerate your career
            with our pro plans.
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
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 mb-3"></div>
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

                  <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                </div>
              ))
            : plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
                    plan.popular
                      ? 'border-blue-500 shadow-md scale-105 z-10 bg-white ring-1 ring-blue-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${plan.color} flex items-center justify-center mb-3`}
                    >
                      <plan.icon
                        className={`w-5 h-5 ${
                          plan.id !== 'basic' ? 'text-orange-600' : 'text-gray-600'
                        }`}
                      />
                    </div>
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

                  <Button
                    className={`w-full py-2 h-auto text-sm font-semibold rounded-lg transition-all duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 hover:shadow-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                  </Button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;

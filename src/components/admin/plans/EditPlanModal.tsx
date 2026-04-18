import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';
import InputFiled from '@/components/common/Input';
import { z } from 'zod';
import type { IGetAllPlansResponse } from '@/types/response.types';
import { updatePlanAdmin } from '@/api/admin/payment-management';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: IGetAllPlansResponse | null;
  setPlans: React.Dispatch<React.SetStateAction<IGetAllPlansResponse[]>>;
}

const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(50, 'Plan name is too long'),
  price: z.coerce.number().min(0, 'Price must be a non-negative number'),
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  features: z
    .array(z.string().min(1, "Feature can't be empty"))
    .min(1, 'At least one feature is required'),
});

const EditPlanModal: React.FC<EditPlanModalProps> = ({ isOpen, onClose, plan, setPlans }) => {
  const [formData, setFormData] = useState<IGetAllPlansResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({ ...plan });
      setErrors({});
      setIsChanged(false);
    }
  }, [plan]);

  useEffect(() => {
    if (plan && formData) {
      const hasChanged =
        plan.name !== formData.name ||
        plan.price !== formData.price ||
        plan.description !== formData.description ||
        JSON.stringify(plan.features) !== JSON.stringify(formData.features);
      setIsChanged(hasChanged);
    }
  }, [formData, plan]);

  if (!plan || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
    if (errors.features) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.features;
        return newErrors;
      });
    }
  };

  const addFeature = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, features: [...prev.features, ''] };
    });
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newFeatures = prev.features.filter((_, i) => i !== index);
      return { ...prev, features: newFeatures };
    });
  };

  const handleSave = async () => {
    if (!formData) return;

    const result = planSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          newErrors[key] = messages[0];
        }
      });

      setErrors(newErrors);
      return;
    }

    try {
      const response = await updatePlanAdmin(formData);
      if (response.success) {
        toast.success('Plan updated successfully',toastifyOptionsCenter);
        setPlans((prev) => prev.map((plan) => (plan.id === formData.id ? formData : plan)));
        onClose();
      }
    } catch (error) {
      toast.error('Failed to update plan',toastifyOptionsCenter);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
      <div className="p-6 font-['anybody-regular']">
        <h2 className="text-xl font-bold mb-5 text-gray-800">Edit Plan : {formData.name}</h2>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
          <InputFiled
            label="Plan Name"
            name="name"
            value={formData.name}
            handleChange={handleChange}
            placeholder="Enter plan name"
            error={errors.name}
          />

          <InputFiled
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            handleChange={handleChange}
            placeholder="Enter price"
            error={errors.price}
          />

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700 pl-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`border p-2.5 rounded-md text-sm w-full resize-none ${
                errors.description
                  ? 'border-red-300 outline-red-600'
                  : 'border-gray-200 outline-gray-200'
              }`}
              placeholder="Enter comprehensive description"
            />
            {errors.description && (
              <span className="text-xs pl-1 text-red-500">{errors.description}</span>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 pl-1">Features</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addFeature}
                className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Feature
              </Button>
            </div>

            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center group">
                  <span className="text-xs text-gray-400 w-4 text-center">{index + 1}.</span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-grow border border-gray-200 p-2 rounded-md text-sm outline-gray-200 focus:outline-blue-200 transition-all"
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.features.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">No features added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="h-7 text-xs"
                  >
                    Add First Feature
                  </Button>
                </div>
              )}
              {errors.features && (
                <span className="text-xs pl-1 text-red-500 block">{errors.features}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-4 h-9 text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isChanged}
            className={`px-4 h-9 text-sm text-white ${
              !isChanged ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPlanModal;

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import InputFiled from '../common/Input';
import Modal from '../common/Modal';
import SelectTag from '../common/select';
import TextArea from '../common/Textarea';
import { Button } from '../ui/Button';
import type { IInterviewData } from '@/types/types';

const interviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  context: z.string().min(10, 'Context must be at least 10 characters'),
  numberOfQuestions: z.coerce.number().min(1, 'At least 1 question is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
});

interface IAddEditInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IInterviewData) => void;
  data: IInterviewData;
  setData: React.Dispatch<React.SetStateAction<IInterviewData>>;
  loading: boolean;
}

const AddEditInterviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  loading,
}: IAddEditInterviewModalProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const result = interviewSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      setTouched({});
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleChangeInputField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (value: string) => {
    setTouched((prev) => ({ ...prev, difficulty: true }));
    setData((prev) => ({ ...prev, difficulty: value }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const result = interviewSchema.safeParse(data);
    if (result.success) {
      onSubmit(data);
    }
  };
  return (
    <Modal isOpen={isOpen} className="sm:max-w-xl max-w-[90vw]">
      <h3 className="text-2xl font-semibold px-2 text-center py-2">Add Interview</h3>
      <div className="max-h-[80vh] overflow-y-auto flex flex-col gap-3">
        <InputFiled
          className="border-gray-300"
          placeholder="Title"
          name="title"
          value={data.title}
          handleChange={handleChangeInputField}
          label="Title"
          error={touched.title || isSubmitted ? errors.title : ''}
        />

        <TextArea
          className="border-gray-300"
          placeholder="Description"
          name="description"
          label="Description"
          value={data.description}
          handleChange={handleChangeInputField}
          error={touched.description || isSubmitted ? errors.description : ''}
        />
        <TextArea
          className="border-gray-300"
          placeholder="Explain the context it will help system to generate questions"
          name="context"
          label="Context"
          value={data.context}
          handleChange={handleChangeInputField}
          error={touched.context || isSubmitted ? errors.context : ''}
        />

        <InputFiled
          className="border-gray-300"
          placeholder="Number of questions"
          name="numberOfQuestions"
          type="number"
          label="Number of questions"
          value={data.numberOfQuestions}
          handleChange={handleChangeInputField}
          error={touched.numberOfQuestions || isSubmitted ? errors.numberOfQuestions : ''}
        />
        <SelectTag
          options={[
            { label: 'Easy', value: 'easy' },
            { label: 'Medium', value: 'medium' },
            { label: 'Hard', value: 'hard' },
          ]}
          placeholder="Select Difficulty"
          label="Difficulty"
          head="Difficulty"
          name="difficulty"
          value={data.difficulty}
          handleChange={handleDifficultyChange}
          error={touched.difficulty || isSubmitted ? errors.difficulty : ''}
        ></SelectTag>
        {/* <div className="flex items-center gap-2 justify-between px-1">
          <label className="text-sm">Premium</label>
          <Switch
            checked={data.premium}
            onCheckedChange={(value) => setData((prev) => ({ ...prev, premium: value }))}
          />
        </div> */}

        <InputFiled
          className="border-gray-300"
          placeholder="Duration in minutes"
          name="duration"
          type="number"
          label="Duration "
          value={data.duration}
          handleChange={handleChangeInputField}
          error={touched.duration || isSubmitted ? errors.duration : ''}
        />

        <div className="flex justify-end gap-2 pt-5">
          <Button variant={'outline'} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {data.id ? 'Update Interview' : 'Add Interview'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditInterviewModal;

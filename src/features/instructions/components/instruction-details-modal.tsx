'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomModal } from '@/components/ui/custom-model';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  instructionDetailsSchema,
  type InstructionDetailsFormValues
} from '@/lib/zod-schema/instruction-schema';
import {
  useUpdateInstruction,
  type Instruction
} from '../utils/use-instructions';

function InstructionDetailsModalHelper({
  instruction,
  projectId,
  showModal,
  setShowModal
}: {
  instruction: Instruction;
  projectId: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const updateInstruction = useUpdateInstruction(projectId, instruction.id);

  const form = useForm<InstructionDetailsFormValues>({
    resolver: zodResolver(instructionDetailsSchema),
    defaultValues: {
      title: instruction.title,
      description: instruction.description ?? ''
    }
  });

  useEffect(() => {
    if (showModal) {
      form.reset({
        title: instruction.title,
        description: instruction.description ?? ''
      });
    }
  }, [showModal, instruction, form]);

  async function onSubmit(values: InstructionDetailsFormValues) {
    await updateInstruction.mutateAsync(values, {
      onSuccess: () => setShowModal(false)
    });
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-lg'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Edit details</h3>
        <p className='text-sm text-neutral-500'>
          Update this instruction's title and description. Content is edited
          separately.
        </p>
      </div>

      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-4 py-4 sm:px-6'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Frontend Architecture' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='A short summary of what this instruction covers'
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={updateInstruction.isPending}>
            {updateInstruction.isPending && <Spinner className='mr-2' />}
            Save changes
          </Button>
        </div>
      </Form>
    </CustomModal>
  );
}

export function useInstructionDetailsModal({
  instruction,
  projectId
}: {
  instruction: Instruction;
  projectId: string;
}) {
  const [showInstructionDetailsModal, setShowInstructionDetailsModal] =
    useState(false);

  const InstructionDetailsModal = useCallback(() => {
    return (
      <InstructionDetailsModalHelper
        instruction={instruction}
        projectId={projectId}
        showModal={showInstructionDetailsModal}
        setShowModal={setShowInstructionDetailsModal}
      />
    );
  }, [instruction, projectId, showInstructionDetailsModal]);

  return useMemo(
    () => ({ setShowInstructionDetailsModal, InstructionDetailsModal }),
    [setShowInstructionDetailsModal, InstructionDetailsModal]
  );
}

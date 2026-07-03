import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function InstructionsPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='page'
        title='No Instructions yet'
        description='Instructions define AI behavior rules, coding conventions, and team workflows for this project.'
      />
    </div>
  );
}

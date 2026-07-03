import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function ChecklistsPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='clipboardX'
        title='No Checklists yet'
        description='Checklists cover QA, release, security, and deployment verification for this project.'
      />
    </div>
  );
}

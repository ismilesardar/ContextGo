import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function ApprovalsPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='shield'
        title='No Approvals yet'
        description='Review and approve proposed changes before they become active project knowledge.'
      />
    </div>
  );
}

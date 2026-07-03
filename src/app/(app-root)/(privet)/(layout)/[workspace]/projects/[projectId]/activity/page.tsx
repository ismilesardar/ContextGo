import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function ActivityPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='dashboard'
        title='No Activity yet'
        description="This project's activity timeline, resource updates, and audit events will show up here."
      />
    </div>
  );
}

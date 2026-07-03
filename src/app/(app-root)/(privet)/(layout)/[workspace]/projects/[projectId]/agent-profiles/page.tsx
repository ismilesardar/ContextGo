import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function AgentProfilesPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='robot'
        title='No Agent Profiles yet'
        description='Agent Profiles combine multiple resources into reusable AI role packages, like Backend Developer or QA.'
      />
    </div>
  );
}

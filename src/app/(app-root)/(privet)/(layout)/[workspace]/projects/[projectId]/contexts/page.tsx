import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function ContextsPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='fileText'
        title='No Contexts yet'
        description="Contexts capture your project's architecture, business rules, and technical decisions so every AI tool follows the same knowledge."
      />
    </div>
  );
}

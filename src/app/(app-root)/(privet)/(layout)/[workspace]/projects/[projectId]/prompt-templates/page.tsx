import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function PromptTemplatesPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='messageCircle'
        title='No Prompt Templates yet'
        description='Prompt Templates are your team library of reusable prompts for common AI tasks.'
      />
    </div>
  );
}

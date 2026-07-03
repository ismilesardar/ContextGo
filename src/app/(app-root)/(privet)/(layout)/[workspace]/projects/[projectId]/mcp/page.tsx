import { PlaceholderTab } from '@/features/projects/components/placeholder-tab';

export default function McpPage() {
  return (
    <div className='p-6'>
      <PlaceholderTab
        icon='layout'
        title='MCP not configured yet'
        description="Expose this project's approved knowledge to Claude Code, Cursor, and other AI clients through an MCP server."
      />
    </div>
  );
}

'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useProjects } from '@/features/projects/utils/use-projects';
import {
  RESOURCE_TYPE_OPTIONS,
  RESOURCE_TYPE_ROUTE_SEGMENT,
  type LibraryResourceType
} from '../utils/library-copy';
import {
  useImportLibraryTemplate,
  type LibraryTemplateSummary
} from '../utils/use-library-templates';

/**
 * Configure-then-import modal for the global Library page, where a
 * template has already been chosen (via its card or the preview modal) but
 * the target project and resource type aren't known yet — unlike the
 * in-project `TemplatePickerModal`, where both are already locked.
 */
function ImportTemplateModalHelper({
  workspaceSlug,
  template,
  showModal,
  setShowModal
}: {
  workspaceSlug: string;
  template: LibraryTemplateSummary;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [resourceType, setResourceType] = useState<LibraryResourceType | ''>(
    template.suggestedResourceType
  );

  const { data: projects } = useProjects({ status: 'active' });
  const importTemplate = useImportLibraryTemplate();

  function handleImport() {
    if (!projectId || !resourceType) return;
    importTemplate.mutate(
      { templateId: template.id, projectId, resourceType },
      {
        onSuccess: (resource) => {
          setShowModal(false);
          router.push(
            `/${workspaceSlug}/projects/${projectId}/${RESOURCE_TYPE_ROUTE_SEGMENT[resourceType]}/${resource.id}/edit`
          );
        }
      }
    );
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-md'
    >
      <div className='space-y-4 px-4 py-4 sm:px-6'>
        <div>
          <h3 className='text-lg font-medium'>Import "{template.title}"</h3>
          <p className='text-sm text-neutral-500'>
            This will copy content from github/awesome-copilot (MIT-licensed)
            into your project, with attribution appended.
          </p>
        </div>

        <div className='space-y-3'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium'>Project</label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a project' />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium'>Resource type</label>
            <Select
              value={resourceType}
              onValueChange={(value) =>
                setResourceType(value as LibraryResourceType)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a resource type' />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={!projectId || !resourceType || importTemplate.isPending}
            onClick={handleImport}
          >
            {importTemplate.isPending && <Spinner className='mr-2' />}
            Import
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

export function useImportTemplateModal({
  workspaceSlug
}: {
  workspaceSlug: string;
}) {
  const [template, setTemplate] = useState<LibraryTemplateSummary | null>(null);

  const openImportModal = useCallback((next: LibraryTemplateSummary) => {
    setTemplate(next);
  }, []);

  const ImportTemplateModal = useCallback(() => {
    if (!template) return null;
    return (
      <ImportTemplateModalHelper
        workspaceSlug={workspaceSlug}
        template={template}
        showModal={!!template}
        setShowModal={() => setTemplate(null)}
      />
    );
  }, [workspaceSlug, template]);

  return useMemo(
    () => ({ openImportModal, ImportTemplateModal }),
    [openImportModal, ImportTemplateModal]
  );
}

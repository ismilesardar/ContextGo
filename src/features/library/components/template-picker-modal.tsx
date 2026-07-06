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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import {
  CATEGORY_LABELS,
  RESOURCE_TYPE_ROUTE_SEGMENT,
  type LibraryResourceType,
  type LibrarySourceCategory
} from '../utils/library-copy';
import {
  useImportLibraryTemplate,
  useLibraryTemplates,
  type LibraryTemplateSummary
} from '../utils/use-library-templates';
import { TemplateCard } from './template-card';
import { TemplatePreviewModal } from './template-preview-modal';

const CATEGORY_FILTER_OPTIONS = Object.entries(CATEGORY_LABELS) as [
  LibrarySourceCategory,
  string
][];

/**
 * Browse-and-immediately-import picker for the "Use template" entry point
 * that lives on each resource type's list page inside a project. The target
 * project and resource type are already known from that page, so selecting a
 * template creates the resource right away — no separate configure step,
 * unlike the global Library page's `ImportTemplateModal`.
 */
function TemplatePickerModalHelper({
  workspaceSlug,
  projectId,
  resourceType,
  showModal,
  setShowModal
}: {
  workspaceSlug: string;
  projectId: string;
  resourceType: LibraryResourceType;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [category, setCategory] = useState<LibrarySourceCategory | 'all'>(
    'all'
  );
  const [previewTemplate, setPreviewTemplate] =
    useState<LibraryTemplateSummary | null>(null);

  const { data, isLoading } = useLibraryTemplates({
    search: debouncedSearch || undefined,
    category: category === 'all' ? undefined : category,
    pageSize: 100
  });
  const templates = data?.templates;

  const importTemplate = useImportLibraryTemplate();

  function handleUse(template: LibraryTemplateSummary) {
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
    <>
      <CustomModal
        showModal={showModal}
        setShowModal={setShowModal}
        className='sm:max-w-2xl'
      >
        <div className='flex max-h-[80vh] flex-col'>
          <div className='space-y-3 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
            <h3 className='text-lg font-medium'>Use a template</h3>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Input
                placeholder='Search templates...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='sm:max-w-xs'
              />
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as LibrarySourceCategory | 'all')
                }
              >
                <SelectTrigger className='w-40'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All categories</SelectItem>
                  {CATEGORY_FILTER_OPTIONS.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6'>
            {isLoading ? (
              <p className='text-muted-foreground text-sm'>
                Loading templates...
              </p>
            ) : !templates || templates.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No templates match your search.
              </p>
            ) : (
              templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  compact
                  onPreview={() => setPreviewTemplate(template)}
                  onUse={() => handleUse(template)}
                />
              ))
            )}
          </div>
        </div>
      </CustomModal>

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          showModal={true}
          setShowModal={() => setPreviewTemplate(null)}
          onUse={() => handleUse(previewTemplate)}
        />
      )}
    </>
  );
}

export function useTemplatePickerModal({
  workspaceSlug,
  projectId,
  resourceType
}: {
  workspaceSlug: string;
  projectId: string;
  resourceType: LibraryResourceType;
}) {
  const [showTemplatePickerModal, setShowTemplatePickerModal] = useState(false);

  const TemplatePickerModal = useCallback(() => {
    return (
      <TemplatePickerModalHelper
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        resourceType={resourceType}
        showModal={showTemplatePickerModal}
        setShowModal={setShowTemplatePickerModal}
      />
    );
  }, [workspaceSlug, projectId, resourceType, showTemplatePickerModal]);

  return useMemo(
    () => ({ setShowTemplatePickerModal, TemplatePickerModal }),
    [setShowTemplatePickerModal, TemplatePickerModal]
  );
}

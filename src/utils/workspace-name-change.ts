type ChangeWorkspaceNameProps = {
  pathName: string;
  oldName: string;
  newName: string;
};

export const changeWorkspaceName = ({
  pathName,
  oldName,
  newName
}: ChangeWorkspaceNameProps) => {
  const pathSegments = pathName.split('/');
  const newSegments = pathSegments.map((s) => {
    if (s === oldName) {
      return newName;
    }
    return s;
  });

  const newPath = newSegments.join('/');

  return newPath;
};

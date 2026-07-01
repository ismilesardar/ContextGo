// const setLastUsedWorkspace = (workspace_name: string) => {
//   localStorage.setItem('last_workspace_use', JSON.stringify(workspace_name));
// };

// const getLastUsedWorkspace = () => {
//   const item = localStorage.getItem('last_workspace_use');
//   return item ? JSON.parse(item) : null;
// };

// src/utils/workspace-session.ts

const setSessionWorkspace = (workspace_name: string) => {
  if (typeof window !== 'undefined') {
    // No Max-Age or Expires means it's a Session Cookie
    document.cookie = `last_workspace_slug=${workspace_name}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }
};

const setActiveWorkspaceName = (workspace_name: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(
      'last_active_workspace',
      JSON.stringify(workspace_name)
    );
  }
};

const getSessionData = (variable_name: string) => {
  if (typeof window !== 'undefined' && variable_name) {
    const saved = sessionStorage.getItem(variable_name);
    return saved ? JSON.parse(saved) : null;
  }
};

export { setSessionWorkspace, setActiveWorkspaceName, getSessionData };

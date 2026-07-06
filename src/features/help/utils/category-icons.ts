import {
  IconRocket,
  IconStack2,
  IconUsersGroup,
  IconBooks,
  IconRobot,
  IconUserCircle,
  type IconProps
} from '@tabler/icons-react';

export const CATEGORY_ICONS: Record<string, React.ComponentType<IconProps>> = {
  'getting-started': IconRocket,
  resources: IconStack2,
  collaboration: IconUsersGroup,
  library: IconBooks,
  'ai-tools': IconRobot,
  account: IconUserCircle
};

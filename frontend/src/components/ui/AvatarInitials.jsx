import { Avatar } from '@mui/material';
import { memo } from 'react';

import { colors, radius } from '../../theme/tokens';

const palette = [
  colors.brand[600],
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function AvatarInitials({ name, size = 40 }) {
  const index = name.charCodeAt(0) % palette.length;
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: palette[index],
        fontSize: size * 0.38,
        fontWeight: 700,
        borderRadius: radius.md,
      }}
      aria-label={name}
    >
      {getInitials(name)}
    </Avatar>
  );
}

export default memo(AvatarInitials);

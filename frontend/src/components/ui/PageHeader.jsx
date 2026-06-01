import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

function PageHeader({ title, description, breadcrumbs = [], action }) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<ChevronRight size={14} />}
          sx={{ mb: 1.5, '& .MuiBreadcrumbs-li': { fontSize: '0.8125rem' } }}
          aria-label="breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (crumb.to && !isLast) {
              return (
                <Link key={crumb.label} component={RouterLink} to={crumb.to} underline="hover" color="text.secondary">
                  {crumb.label}
                </Link>
              );
            }
            return (
              <Typography key={crumb.label} color={isLast ? 'text.primary' : 'text.secondary'} fontWeight={isLast ? 600 : 400}>
                {crumb.label}
              </Typography>
            );
          })}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    </Box>
  );
}

export { Button };
export default memo(PageHeader);

import React from 'react';
import { Skeleton, Stack, Box, Card, CardContent } from '@mui/material';

/**
 * Replaces mock setTimeout loading with real skeleton loaders
 * Gives users proper visual feedback instead of blank screens
 */

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={1}
          sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: '4px' }}
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="text" sx={{ flex: 1 }} />
          ))}
        </Stack>
      ))}
    </Box>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </CardContent>
    </Card>
  );
}

export function FormSkeleton() {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={56} />
      ))}
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Stack>
    </Stack>
  );
}

export function ListItemSkeleton({ count = 3 }) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={60} />
      ))}
    </Stack>
  );
}

export default function SkeletonLoader({ type = 'table', ...props }) {
  const types = {
    table: <TableSkeleton {...props} />,
    card: <CardSkeleton {...props} />,
    form: <FormSkeleton {...props} />,
    list: <ListItemSkeleton {...props} />,
  };

  return types[type] || types.table;
}

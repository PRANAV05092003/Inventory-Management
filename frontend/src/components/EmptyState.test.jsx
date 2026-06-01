import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmptyState from './ui/EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState title="No items" message="Add something to begin." />);

    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Add something to begin.')).toBeInTheDocument();
  });
});

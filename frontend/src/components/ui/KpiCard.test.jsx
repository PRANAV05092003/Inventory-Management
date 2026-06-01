import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import KpiCard from './KpiCard';

describe('KpiCard', () => {
  it('renders title and value', () => {
    render(<KpiCard title="Total Products" value={42} />);

    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});

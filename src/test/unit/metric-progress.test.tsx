import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricProgress } from '@/components/ui/metric-progress';

describe('MetricProgress', () => {
  it('renders label and percent', () => {
    render(<MetricProgress label="蛋白质" valueLabel="(120g/150g)" percent={80} />);
    expect(screen.getByText(/蛋白质/)).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders progress bar with correct width style', () => {
    const { container } = render(
      <MetricProgress label="热量" valueLabel="(1850/2200)" percent={84} />
    );
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar).toBeTruthy();
    expect(bar.style.width).toBe('84%');
  });

  it('shows 0% when percent is 0', () => {
    render(<MetricProgress label="碳水" valueLabel="(0/250g)" percent={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('shows 100% when fully completed', () => {
    render(<MetricProgress label="纤维" valueLabel="(25g/25g)" percent={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

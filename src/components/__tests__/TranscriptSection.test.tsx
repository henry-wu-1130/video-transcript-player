import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TranscriptSection } from '../TranscriptSection';
import type { TranscriptSection as ITranscriptSection } from '../../stores/videoStore';

describe('TranscriptSection', () => {
  const mockSection: ITranscriptSection = {
    id: 'test-section',
    title: '測試段落',
    summary: '測試摘要',
    items: [
      { time: 0, text: '測試文字 1', isHighlight: false },
      { time: 10, text: '測試文字 2', isHighlight: true },
      { time: 20, text: '測試文字 3', isHighlight: false },
    ],
  };

  const mockOnTimeClick = vi.fn();
  const mockOnToggleSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title and all items', () => {
    render(
      <TranscriptSection
        section={mockSection}
        currentItemIndex={0}
        onTimeClick={mockOnTimeClick}
        onToggleSelection={mockOnToggleSelection}
      />
    );

    // Check section title
    expect(screen.getByText('測試段落')).toBeInTheDocument();

    // Check all items are rendered
    expect(screen.getByText('測試文字 1')).toBeInTheDocument();
    expect(screen.getByText('測試文字 2')).toBeInTheDocument();
    expect(screen.getByText('測試文字 3')).toBeInTheDocument();
  });

  it('highlights current item correctly', () => {
    render(
      <TranscriptSection
        section={mockSection}
        currentItemIndex={1}
        onTimeClick={mockOnTimeClick}
        onToggleSelection={mockOnToggleSelection}
      />
    );

    // Get all transcript items
    const items = screen.getAllByTestId('transcript-item');

    // Check that only the current item has the golden border
    expect(items[1]).toHaveClass('border-amber-400');
    expect(items[0]).not.toHaveClass('border-amber-400');
    expect(items[2]).not.toHaveClass('border-amber-400');
  });

  it('shows highlighted items with blue background', () => {
    render(
      <TranscriptSection
        section={mockSection}
        currentItemIndex={0}
        onTimeClick={mockOnTimeClick}
        onToggleSelection={mockOnToggleSelection}
      />
    );

    // Get all transcript items
    const items = screen.getAllByTestId('transcript-item');

    // Check that highlighted item has blue background
    expect(items[1]).toHaveClass('bg-blue-500'); // Second item is highlighted
  });

  it('calls onTimeClick when time button is clicked', () => {
    render(
      <TranscriptSection
        section={mockSection}
        currentItemIndex={0}
        onTimeClick={mockOnTimeClick}
        onToggleSelection={mockOnToggleSelection}
      />
    );

    // Click on the first time button
    const timeButtons = screen.getAllByRole('button');
    fireEvent.click(timeButtons[0]);

    // Check if onTimeClick was called with correct time
    expect(mockOnTimeClick).toHaveBeenCalledWith(0);
  });

  it('calls onToggleSelection when item is clicked', () => {
    render(
      <TranscriptSection
        section={mockSection}
        currentItemIndex={0}
        onTimeClick={mockOnTimeClick}
        onToggleSelection={mockOnToggleSelection}
      />
    );

    // Click on the first item
    const items = screen.getAllByTestId('transcript-item');
    fireEvent.click(items[0]);

    // Check if onToggleSelection was called with correct index
    expect(mockOnToggleSelection).toHaveBeenCalledWith(0);
  });
});

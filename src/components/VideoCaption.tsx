import { useTranscriptItemMap } from '../hooks/useTranscript';
import { useVideoStore } from '../stores/videoStore';
import Draggable from 'react-draggable';
import { useEffect, useRef, useState } from 'react';

export function VideoCaption() {
  const { sections, currentTime } = useVideoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        setBounds({
          left: -rect.width / 2,
          top: 0,
          right: rect.width / 2,
          bottom: rect.height - 60 // 保留一些空間給控制項
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  if (!sections || sections.length === 0) {
    return null;
  }

  const { currentItem } = useTranscriptItemMap(sections, currentTime);

  if (!currentItem) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <Draggable
        position={position}
        onDrag={(_, data) => setPosition({ x: data.x, y: data.y })}
        bounds={bounds}
      >
        <div className="inline-block absolute left-1/2 top-4 pointer-events-auto cursor-move">
          <div className="px-3 py-1.5 bg-black/85 text-white text-center text-sm sm:text-base rounded shadow-lg backdrop-blur-sm max-w-lg animate-fade-in group">
            <div className="absolute inset-x-0 -top-1 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            {currentItem.text}
          </div>
        </div>
      </Draggable>
    </div>
  );
}

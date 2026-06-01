import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HorizontalCarousel - Komponen carousel horizontal snap scroll
 * 
 * Props:
 *   items    : array item
 *   rows     : 1 | 2 | 3  — jumlah baris yang ditampilkan
 *   itemWidth: string CSS width per item (default '280px')
 *   renderItem: fn(item, index) => ReactNode
 *   emptyState: ReactNode
 */
export default function HorizontalCarousel({ items = [], rows = 1, itemWidth = '280px', renderItem, emptyState }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(updateArrows, 350);
  };

  if (!items.length && emptyState) return emptyState;

  // Split items into columns of `rows` items each
  const cols = Math.ceil(items.length / rows);
  const columns = [];
  for (let i = 0; i < cols; i++) {
    columns.push(items.slice(i * rows, i * rows + rows));
  }

  return (
    <div className="relative group/carousel">
      {/* Arrow Left */}
      {canLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-slate-200 shadow-xl hover:bg-brand-600 hover:border-brand-500 transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="carousel-snap no-scrollbar pb-2"
      >
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col gap-4"
            style={{ width: itemWidth, minWidth: itemWidth }}
          >
            {col.map((item, rowIdx) => (
              <div key={rowIdx} style={{ width: itemWidth }}>
                {renderItem(item, colIdx * rows + rowIdx)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Arrow Right */}
      {canRight && items.length > 0 && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-slate-200 shadow-xl hover:bg-brand-600 hover:border-brand-500 transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scroll dots indicator */}
      {items.length > rows && (
        <p className="text-center text-[10px] text-slate-500 mt-2 select-none">
          ← geser untuk melihat lebih banyak →
        </p>
      )}
    </div>
  );
}

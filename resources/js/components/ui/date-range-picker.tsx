import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

// Senin .. Minggu
const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISO(value?: string | null): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDisplay(value?: string | null) {
  const date = parseISO(value);
  if (!date) return 'Pilih tanggal';
  return `${`${date.getDate()}`.padStart(2, '0')} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

/* ------------------------------------------------------------------ */
/* Month grid                                                          */
/* ------------------------------------------------------------------ */

function MonthGrid({
  month,
  rangeStart,
  rangeEnd,
  hoverDate,
  onPick,
  onHover,
  showPrev,
  showNext,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: {
  month: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  onPick: (date: Date) => void;
  onHover: (date: Date | null) => void;
  showPrev: boolean;
  showNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}) {
  const today = startOfDay(new Date());

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    // Monday = 0 ... Sunday = 6
    const leading = (first.getDay() + 6) % 7;
    const list: (Date | null)[] = Array.from({ length: leading }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push(new Date(month.getFullYear(), month.getMonth(), d));
    }
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [month]);

  const previewEnd = rangeEnd ?? (rangeStart && hoverDate ? hoverDate : null);

  return (
    <div className="w-[266px] select-none">
      <div className="mb-2 flex items-center justify-between">
        {showPrev ? (
          <button
            type="button"
            onClick={onPrev}
            disabled={!canGoPrev}
            aria-label="Bulan sebelumnya"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <span className="h-7 w-7" />
        )}
        <p className="text-[13px] font-semibold text-gray-800">
          {MONTHS_ID[month.getMonth()]} {month.getFullYear()}
        </p>
        {showNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Bulan berikutnya"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <span className="h-7 w-7" />
        )}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-7 items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-gray-400"
          >
            {day}
          </div>
        ))}

        {cells.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="h-8" />;

          const isStart = isSameDay(date, rangeStart);
          const isEnd = isSameDay(date, previewEnd);
          const inRange =
            rangeStart && previewEnd
              ? date.getTime() > Math.min(rangeStart.getTime(), previewEnd.getTime()) &&
                date.getTime() < Math.max(rangeStart.getTime(), previewEnd.getTime())
              : false;
          const isToday = isSameDay(date, today);
          const isSelected = isStart || isEnd;

          return (
            <div
              key={toISO(date)}
              className={cn(
                'relative flex h-8 items-center justify-center',
                inRange && 'bg-blue-50',
                isStart && previewEnd && date.getTime() < previewEnd.getTime() && 'rounded-l-full bg-blue-50',
                isEnd && rangeStart && date.getTime() > rangeStart.getTime() && 'rounded-r-full bg-blue-50',
              )}
            >
              <button
                type="button"
                onClick={() => onPick(date)}
                onMouseEnter={() => onHover(date)}
                onMouseLeave={() => onHover(null)}
                aria-label={`${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`}
                aria-pressed={isSelected}
                className={cn(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[12.5px] font-medium transition-colors',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700',
                  !isSelected && isToday && 'ring-1 ring-inset ring-blue-300',
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  label?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label = 'Periode Laporan',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState<Date | null>(parseISO(startDate));
  const [draftEnd, setDraftEnd] = useState<Date | null>(parseISO(endDate));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const base = parseISO(startDate) ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync draft when parent value changes while closed
  useEffect(() => {
    if (open) return;
    setDraftStart(parseISO(startDate));
    setDraftEnd(parseISO(endDate));
  }, [startDate, endDate, open]);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const openPicker = () => {
    const base = parseISO(startDate) ?? new Date();
    setDraftStart(parseISO(startDate));
    setDraftEnd(parseISO(endDate));
    setViewMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    setHoverDate(null);
    setOpen(true);
  };

  const handlePick = (date: Date) => {
    const picked = startOfDay(date);
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(picked);
      setDraftEnd(null);
      return;
    }
    if (picked.getTime() < draftStart.getTime()) {
      setDraftStart(picked);
      setDraftEnd(null);
      return;
    }
    setDraftEnd(picked);
  };

  const apply = (start: Date | null, end: Date | null) => {
    if (!start) return;
    const finalEnd = end && end.getTime() >= start.getTime() ? end : start;
    onChange(toISO(start), toISO(finalEnd));
    setOpen(false);
  };

  const handleApply = () => {
    if (!draftStart) return;
    apply(draftStart, draftEnd);
  };

  const applyPreset = (from: Date, to: Date) => {
    apply(startOfDay(from), startOfDay(to));
  };

  const presets = useMemo(() => {
    const today = startOfDay(new Date());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthEnd = addDays(monthStart, -1);
    const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);
    return [
      { label: '7 hari terakhir', from: addDays(today, -6), to: today },
      { label: '30 hari terakhir', from: addDays(today, -29), to: today },
      { label: 'Bulan ini', from: monthStart, to: today },
      { label: 'Bulan lalu', from: lastMonthStart, to: lastMonthEnd },
      { label: 'Tahun ini', from: new Date(today.getFullYear(), 0, 1), to: today },
    ];
  }, []);

  const today = startOfDay(new Date());
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 12, 1);
  const minMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 60, 1);

  const canGoPrev = viewMonth.getTime() > minMonth.getTime();
  const canGoNext = addMonths(viewMonth, 1).getTime() <= maxMonth.getTime();

  const summary =
    startDate && endDate
      ? `${formatDisplay(startDate)} — ${formatDisplay(endDate)}`
      : 'Pilih rentang tanggal';

  const dayCount =
    draftStart && draftEnd
      ? Math.round((draftEnd.getTime() - draftStart.getTime()) / 86_400_000) + 1
      : null;

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>

      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'group flex h-11 w-full items-center gap-2.5 rounded-lg border bg-gray-50/50 px-3 text-left transition-all',
          'hover:border-blue-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
          open ? 'border-blue-500 bg-white ring-1 ring-blue-500' : 'border-gray-200',
        )}
      >
        <CalendarIcon
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            open ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500',
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
          {summary}
        </span>
        {startDate && endDate ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Reset periode"
            onClick={(event) => {
              event.stopPropagation();
              const today2 = startOfDay(new Date());
              onChange(toISO(addDays(today2, -29)), toISO(today2));
            }}
            className="rounded-md p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Pilih rentang tanggal"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(760px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5"
        >
          <div className="flex flex-col md:flex-row">
            {/* Presets */}
            <div className="shrink-0 border-b border-gray-100 bg-gray-50/60 p-3 md:w-[150px] md:border-b-0 md:border-r">
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Cepat
              </p>
              <div className="flex flex-wrap gap-1 md:flex-col">
                {presets.map((preset) => {
                  const active =
                    draftStart &&
                    draftEnd &&
                    isSameDay(draftStart, preset.from) &&
                    isSameDay(draftEnd, preset.to);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset.from, preset.to)}
                      className={cn(
                        'rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors',
                        active
                          ? 'bg-blue-600 font-medium text-white'
                          : 'text-gray-600 hover:bg-white hover:text-gray-900',
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calendars */}
            <div className="flex-1 p-3">
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                <MonthGrid
                  month={viewMonth}
                  rangeStart={draftStart}
                  rangeEnd={draftEnd}
                  hoverDate={hoverDate}
                  onPick={handlePick}
                  onHover={setHoverDate}
                  showPrev
                  showNext={false}
                  onPrev={() => setViewMonth((m) => addMonths(m, -1))}
                  onNext={() => setViewMonth((m) => addMonths(m, 1))}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                />
                <div className="hidden sm:block">
                  <MonthGrid
                    month={addMonths(viewMonth, 1)}
                    rangeStart={draftStart}
                    rangeEnd={draftEnd}
                    hoverDate={hoverDate}
                    onPick={handlePick}
                    onHover={setHoverDate}
                    showPrev={false}
                    showNext
                    onPrev={() => setViewMonth((m) => addMonths(m, -1))}
                    onNext={() => setViewMonth((m) => addMonths(m, 1))}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-3 py-2.5">
            <p className="text-[12px] text-gray-500">
              {draftStart ? (
                <>
                  <span className="font-medium text-gray-700">{formatDisplay(toISO(draftStart))}</span>
                  {draftEnd ? (
                    <>
                      {' '}
                      <span className="text-gray-400">s/d</span>{' '}
                      <span className="font-medium text-gray-700">{formatDisplay(toISO(draftEnd))}</span>
                      {dayCount ? (
                        <span className="ml-2 rounded bg-white px-1.5 py-0.5 text-[11px] font-medium text-blue-600 ring-1 ring-blue-100">
                          {dayCount} hari
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="ml-2 text-[11.5px] italic text-gray-400">
                      pilih tanggal akhir
                    </span>
                  )}
                </>
              ) : (
                <span className="italic text-gray-400">Pilih tanggal mulai</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-1.5 text-[12.5px] font-medium text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!draftStart}
                className="rounded-md bg-blue-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;

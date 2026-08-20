"use client"; // No-op outside Next.js/RSC — safe to delete if your app isn't Next.

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";

/* ════════════════════════════════════════════════════════════════════════
 * Types
 * ════════════════════════════════════════════════════════════════════════ */

export interface Slot {
  id: string;
  starts_at: string;
  ends_at: string;
  status: "open" | "booked";
  booked_name: string | null;
  booked_at: string | null;
  submission_id: string | null;
  /** Computed in the target zone server-side — the client never re-derives it. */
  local_date: string;
  local_time: string;
  duration_minutes: string;
}

export interface ListSlotsResult {
  slots?: Slot[];
  error?: string;
}

export interface CreateSlotsResult {
  created?: number;
  skipped?: number;
  error?: string;
}

export interface GenerateSlotsResult {
  created?: number;
  requested?: number;
  skipped?: number;
  error?: string;
}

/**
 * The transport contract. Implement this against whatever backend the host
 * app has — REST, GraphQL, a mock — and pass it in as the `api` prop. A
 * fetch-based default that matches the original Aura endpoints is provided
 * below via `createSlotsApi()`, but nothing in the component depends on it.
 */
export interface SlotsApi {
  listSlots(from: string, to: string, timeZone: string): Promise<ListSlotsResult>;
  createSlots(input: {
    date: string;
    times: string[];
    durationMinutes: number;
    timeZone: string;
    actor: string;
  }): Promise<CreateSlotsResult>;
  cancelSlot(id: string): Promise<{ error?: string }>;
  generateSlots(input: {
    fromDate: string;
    toDate: string;
    weekdays: number[];
    dayStart: string;
    dayEnd: string;
    durationMinutes: number;
    bufferMinutes: number;
    timeZone: string;
    actor: string;
  }): Promise<GenerateSlotsResult>;
}

/**
 * Default REST client. Matches the original API shape:
 *   GET    {baseUrl}/slots?from&to&timeZone
 *   POST   {baseUrl}/slots
 *   DELETE {baseUrl}/slots/:id
 *   POST   {baseUrl}/slots/generate
 *
 * Auth is the host app's problem, not this component's — pass whatever
 * headers your backend needs (bearer token, cookies, tenant id, ...).
 */
export function createSlotsApi(config: {
  baseUrl: string;
  headers?: Record<string, string> | (() => Record<string, string>);
}): SlotsApi {
  const resolveHeaders = () =>
    typeof config.headers === "function" ? config.headers() : (config.headers ?? {});

  async function call<T>(path: string, init?: RequestInit): Promise<T | { error: string }> {
    try {
      const res = await fetch(`${config.baseUrl}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...resolveHeaders(), ...init?.headers },
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: `API ${res.status}: ${JSON.stringify(body.message ?? body)}` };
      }
      return (await res.json()) as T;
    } catch {
      return { error: "API unreachable." };
    }
  }

  return {
    async listSlots(from, to, timeZone) {
      const q = new URLSearchParams({ from, to, timeZone });
      const result = await call<{ slots: Slot[] }>(`/slots?${q}`);
      return "error" in result ? { error: result.error } : { slots: result.slots ?? [] };
    },
    async createSlots(input) {
      const result = await call<{ created: unknown[]; skipped: number }>("/slots", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return "error" in result
        ? { error: result.error }
        : { created: result.created?.length ?? 0, skipped: result.skipped ?? 0 };
    },
    async cancelSlot(id) {
      const result = await call<Record<string, never>>(`/slots/${id}`, { method: "DELETE" });
      return "error" in result ? { error: result.error } : {};
    },
    async generateSlots(input) {
      const result = await call<{ created: number; requested: number; skipped: number }>(
        "/slots/generate",
        { method: "POST", body: JSON.stringify(input) },
      );
      return "error" in result ? { error: result.error } : result;
    },
  };
}

/* ════════════════════════════════════════════════════════════════════════
 * Local-calendar date math
 *
 * Every date this component handles is a `YYYY-MM-DD` string plus a `HH:MM`
 * string. It never converts either to a JS Date and back, because
 * `new Date("2026-08-11")` parses as UTC MIDNIGHT — so anywhere west of
 * Greenwich that renders as the 10th, and you create slots on the wrong day.
 * If your backend also does the local-zone → absolute-instant conversion
 * server-side (where the IANA zone database actually lives), keep it that
 * way — don't "fix" this by switching to Date objects.
 * ════════════════════════════════════════════════════════════════════════ */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysInMonth(y: number, m: number): number {
  // Day 0 of the next month is the last day of this one — safe local-time
  // arithmetic on a numeric triple, no string parsing involved.
  return new Date(y, m + 1, 0).getDate();
}

function monthMatrix(y: number, m: number): Array<number | null> {
  const lead = new Date(y, m, 1).getDay();
  const count = daysInMonth(y, m);
  return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ════════════════════════════════════════════════════════════════════════
 * Minimal local UI atoms (plain Tailwind, no design-system dependency)
 * ════════════════════════════════════════════════════════════════════════ */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-lg border border-gray-200 bg-white p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cx(
        "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors",
        "hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

const CONTROL_BASE =
  "w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
  "transition-colors duration-150 ease-out placeholder:text-gray-400 hover:border-gray-400 " +
  "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400";

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(CONTROL_BASE, props.className)} />;
}

function SelectInput({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(CONTROL_BASE, "cursor-pointer appearance-none pr-9", className)} {...rest}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 text-gray-400"
        fill="none"
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Generator — bulk availability across a date range
 * ════════════════════════════════════════════════════════════════════════ */

function Generator({
  api,
  timeZone,
  actor,
  weekdayLabels,
  onDone,
}: {
  api: SlotsApi;
  timeZone: string;
  actor: string;
  weekdayLabels: string[];
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon–Fri
  const [dayStart, setDayStart] = useState("10:00");
  const [dayEnd, setDayEnd] = useState("18:00");
  const [duration, setDuration] = useState(30);
  const [buffer, setBuffer] = useState(10);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  /**
   * The count, or WHY there is no count.
   *
   * The commonest way to get zero is entering 4pm as `04:00` (four in the
   * morning), so the message names whichever field is actually wrong rather
   * than a generic "0 slots" that sends people to look at meeting length.
   * This mirrors whatever range/order validation your backend enforces —
   * keep the two in sync if you change one.
   */
  const preview = useMemo((): { count: number; problem?: string } => {
    const mins = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const a = mins(dayStart);
    const b = mins(dayEnd);

    if (b === a) return { count: 0, problem: "Day starts and day ends are the same time." };
    if (b < a) {
      return {
        count: 0,
        problem:
          `Day ends (${dayEnd}) is before day starts (${dayStart}). ` +
          "These are 24-hour times, so 4pm is 16:00 and 6pm is 18:00.",
      };
    }
    if (b - a < duration) {
      return {
        count: 0,
        problem:
          `A ${duration}-minute meeting does not fit between ${dayStart} and ${dayEnd} — ` +
          `that window is ${b - a} minutes.`,
      };
    }

    // Slots step by duration + buffer, so a 30-minute call with a 10-minute
    // gap produces 10:00, 10:40, 11:20 — nobody is ever booked back-to-back
    // unless buffer is explicitly set to 0.
    let n = 0;
    for (let m = a; m + duration <= b; m += duration + buffer) n += 1;
    return { count: n };
  }, [dayStart, dayEnd, duration, buffer]);

  const perDay = preview.count;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 text-xs font-medium text-blue-600 underline underline-offset-4"
      >
        Generate slots across multiple days
      </button>
    );
  }

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Generate slots</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500">
          Close
        </button>
      </div>

      {err ? (
        <p role="alert" className="mb-3 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
          {err}
        </p>
      ) : null}
      {msg ? <p className="mb-3 text-xs text-gray-500">{msg}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-900">
          From
          <TextInput type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-900">
          To
          <TextInput type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-900">
          Day starts <span className="font-normal text-gray-500">(24-hour)</span>
          <TextInput type="time" step={300} value={dayStart} onChange={(e) => setDayStart(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-900">
          Day ends <span className="font-normal text-gray-500">(24-hour)</span>
          <TextInput type="time" step={300} value={dayEnd} onChange={(e) => setDayEnd(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-900">
          Meeting length
          <SelectInput value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            {[15, 20, 30, 45, 60].map((m) => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </SelectInput>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-900">
          Buffer between
          <SelectInput value={buffer} onChange={(e) => setBuffer(Number(e.target.value))}>
            {[0, 5, 10, 15, 30].map((m) => (
              <option key={m} value={m}>{m === 0 ? "No buffer" : `${m} minutes`}</option>
            ))}
          </SelectInput>
        </label>
      </div>

      <fieldset className="mt-3">
        <legend className="mb-1.5 text-xs font-medium text-gray-900">Days of the week</legend>
        <div className="flex flex-wrap gap-1.5">
          {weekdayLabels.map((w, i) => {
            const on = days.includes(i);
            return (
              <button
                key={w}
                type="button"
                aria-pressed={on}
                onClick={() => setDays((d) => (on ? d.filter((x) => x !== i) : [...d, i]))}
                className={cx(
                  "h-9 w-11 rounded-md border text-xs font-medium transition-colors",
                  on ? "border-transparent bg-blue-600 text-white" : "border-gray-300 text-gray-500 hover:bg-gray-50",
                )}
              >
                {w}
              </button>
            );
          })}
        </div>
      </fieldset>

      {preview.problem ? (
        // Not `role="alert"`: fires on every keystroke while a time is being
        // typed, and a live region announcing a half-typed value per
        // character is worse than silence.
        <p className="mt-3 text-xs font-medium text-amber-600">{preview.problem}</p>
      ) : (
        <p className="mt-3 text-xs text-gray-500">
          {perDay} slot{perDay === 1 ? "" : "s"} per selected day
          {days.length ? ` · ${perDay * days.length} per week` : ""}.
        </p>
      )}

      <PrimaryButton
        className="mt-3"
        disabled={pending || !from || !to || days.length === 0 || perDay === 0}
        onClick={() =>
          start(async () => {
            setErr(null);
            setMsg(null);
            const res = await api.generateSlots({
              fromDate: from,
              toDate: to,
              weekdays: days,
              dayStart,
              dayEnd,
              durationMinutes: duration,
              bufferMinutes: buffer,
              timeZone,
              actor,
            });
            if (res.error) {
              setErr(res.error);
              return;
            }
            // Reports skipped as well as created: re-running over a range
            // that already has slots is a no-op per row, and a bare
            // "created 0" would read as failure when it means "already done".
            setMsg(`Created ${res.created}.${res.skipped ? ` ${res.skipped} already existed.` : ""}`);
            onDone();
          })
        }
      >
        {pending ? "Generating…" : "Generate"}
      </PrimaryButton>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * SlotCalendar — month grid on the left, times for the selected day on the right
 * ════════════════════════════════════════════════════════════════════════ */

export interface SlotCalendarProps {
  timeZone: string;
  /** Custom transport. If omitted, `baseUrl` + `headers` build one via createSlotsApi(). */
  api?: SlotsApi;
  baseUrl?: string;
  headers?: Record<string, string> | (() => Record<string, string>);
  /** Attributed to created/generated slots. Defaults to "console". */
  actor?: string;
}

export function SlotCalendar({ timeZone, api, baseUrl, headers, actor = "console" }: SlotCalendarProps) {
  const client = useMemo(() => {
    if (api) return api;
    if (!baseUrl) {
      throw new Error("SlotCalendar: pass either `api` or `baseUrl`.");
    }
    return createSlotsApi({ baseUrl, headers });
  }, [api, baseUrl, headers]);

  const today = useMemo(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
  }, []);

  const [cursor, setCursor] = useState({ y: today.y, m: today.m });
  const [selected, setSelected] = useState<string>(iso(today.y, today.m, today.d));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(30);

  const monthFrom = iso(cursor.y, cursor.m, 1);
  const monthTo = iso(cursor.y, cursor.m, daysInMonth(cursor.y, cursor.m));

  const refresh = useCallback(() => {
    start(async () => {
      const res = await client.listSlots(monthFrom, monthTo, timeZone);
      if (res.error) setError(res.error);
      else {
        setError(null);
        setSlots(res.slots ?? []);
      }
    });
  }, [client, monthFrom, monthTo, timeZone]);

  useEffect(refresh, [refresh]);

  const byDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const list = map.get(s.local_date) ?? [];
      list.push(s);
      map.set(s.local_date, list);
    }
    return map;
  }, [slots]);

  const daySlots = byDate.get(selected) ?? [];
  const todayIso = iso(today.y, today.m, today.d);

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const m = c.m + delta;
      return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  }

  function addSlot() {
    start(async () => {
      const res = await client.createSlots({ date: selected, times: [time], durationMinutes: duration, timeZone, actor });
      if (res.error) setError(res.error);
      else {
        setError(null);
        setNotice(res.created ? `Added ${time}.` : `${time} already exists on this day.`);
        refresh();
      }
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-900 hover:bg-gray-50"
          >
            ‹
          </button>
          <p className="text-base font-semibold text-gray-900">
            {MONTHS[cursor.m]} {cursor.y}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-900 hover:bg-gray-50"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-2 text-xs font-medium text-gray-500">
              {w}
            </div>
          ))}

          {monthMatrix(cursor.y, cursor.m).map((d, i) => {
            if (d === null) return <div key={`b${i}`} />;
            const date = iso(cursor.y, cursor.m, d);
            const count = byDate.get(date)?.length ?? 0;
            const isSel = date === selected;
            const isPast = date < todayIso;
            return (
              <button
                key={date}
                type="button"
                onClick={() => {
                  setSelected(date);
                  setNotice(null);
                }}
                aria-pressed={isSel}
                aria-label={`${date}${count ? `, ${count} slots` : ""}`}
                className={cx(
                  "relative grid h-11 w-full place-items-center rounded-full text-sm transition-colors",
                  isSel
                    ? "bg-blue-600 font-semibold text-white"
                    : count
                      ? "bg-blue-50 font-medium text-gray-900 hover:bg-blue-100"
                      : isPast
                        ? "text-gray-300"
                        : "text-gray-900 hover:bg-gray-50",
                )}
              >
                {d}
                {count && !isSel ? (
                  <span aria-hidden="true" className="absolute bottom-1.5 h-1 w-1 rounded-full bg-blue-600" />
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-gray-500">
          Time zone <span className="font-medium text-gray-900">{timeZone}</span> · slots are stored as
          absolute instants, so this stays correct across daylight saving.
        </p>

        <Generator api={client} timeZone={timeZone} actor={actor} weekdayLabels={WEEKDAYS} onDone={refresh} />
      </Card>

      <Card>
        <p className="text-xs text-gray-500 tabular-nums">{selected}</p>

        {error ? (
          <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {notice ? <p className="mt-3 text-xs text-gray-500">{notice}</p> : null}

        <div className="mt-4 flex flex-col gap-2">
          {daySlots.length === 0 ? (
            <p className="text-sm text-gray-500">No slots on this day yet.</p>
          ) : (
            daySlots.map((s) => (
              <div
                key={s.id}
                className={cx(
                  "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5",
                  s.status === "booked" ? "border-gray-200 bg-gray-50" : "border-blue-200",
                )}
              >
                <div className="min-w-0">
                  <p className={cx("text-sm font-semibold", s.status === "booked" ? "text-gray-500" : "text-blue-600")}>
                    {s.local_time}
                    <span className="ml-2 font-normal text-gray-500">{Math.round(Number(s.duration_minutes))} min</span>
                  </p>
                  {s.status === "booked" ? (
                    <p className="truncate text-xs text-gray-500">Booked{s.booked_name ? ` — ${s.booked_name}` : ""}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      const res = await client.cancelSlot(s.id);
                      if (res.error) setError(res.error);
                      else refresh();
                    })
                  }
                  className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-500 hover:text-red-700"
                  // Cancel, not delete: a booked slot carries someone's
                  // expectation, and the row is the only record it existed.
                  aria-label={`Cancel ${s.local_time}`}
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 border-t border-gray-200 pt-4">
          <p className="mb-2 text-xs font-medium text-gray-900">Add a slot</p>
          <div className="flex gap-2">
            <TextInput
              type="time"
              value={time}
              step={300}
              onChange={(e) => setTime(e.target.value)}
              className="min-w-0 flex-1"
              aria-label="Start time"
            />
            <SelectInput
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-24"
              aria-label="Duration in minutes"
            >
              {[15, 20, 30, 45, 60].map((m) => (
                <option key={m} value={m}>{m}m</option>
              ))}
            </SelectInput>
          </div>
          <PrimaryButton className="mt-2 w-full justify-center" disabled={pending} onClick={addSlot}>
            {pending ? "Saving…" : "Add slot"}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

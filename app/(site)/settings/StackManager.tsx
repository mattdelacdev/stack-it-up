import Link from "next/link";
import type { Supplement } from "@/lib/supplements";
import type { StackKind, UserStacks } from "@/lib/stacks";
import {
  moveStackItem,
  removeFavorite,
  removeFromStack,
} from "../supplements/[id]/actions";

export default function StackManager({ stacks }: { stacks: UserStacks }) {
  return (
    <section className="mt-8 grid gap-6">
      <h2 className="font-display text-2xl sm:text-3xl">
        <span className="text-gradient">MY STACK</span>
      </h2>
      <p className="text-sm text-text/60 -mt-3">
        Add items from a{" "}
        <Link href="/supplements" className="text-secondary hover:text-accent underline">
          supplement page
        </Link>
        . Anything here shows on your public profile.
      </p>

      <StackList kind="morning" label="Morning stack" emoji="☀️" items={stacks.morning} />
      <StackList kind="evening" label="Evening stack" emoji="🌙" items={stacks.evening} />
      <FavoritesList items={stacks.favorites} />
    </section>
  );
}

function StackList({
  kind,
  label,
  emoji,
  items,
}: {
  kind: StackKind;
  label: string;
  emoji: string;
  items: Supplement[];
}) {
  return (
    <div className="card-retro">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg tracking-[0.15em]">
          <span aria-hidden>{emoji}</span> {label.toUpperCase()}
        </h3>
        <span className="font-mono text-xs text-text/50">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text/60">Nothing here yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-primary/20">
          {items.map((s, idx) => (
            <li key={s.id} className="flex items-center gap-2 py-2">
              <Link
                href={`/supplements/${s.id}`}
                className="flex-1 font-display text-base text-accent hover:text-primary"
              >
                {s.name}
              </Link>
              <span className="hidden sm:inline font-mono text-xs text-text/50">
                {s.dose}
              </span>
              <ReorderButton
                kind={kind}
                supplementId={s.id}
                direction="up"
                disabled={idx === 0}
              />
              <ReorderButton
                kind={kind}
                supplementId={s.id}
                direction="down"
                disabled={idx === items.length - 1}
              />
              <form action={removeFromStack}>
                <input type="hidden" name="supplement_id" value={s.id} />
                <input type="hidden" name="kind" value={kind} />
                <button
                  type="submit"
                  aria-label={`Remove ${s.name} from ${label}`}
                  className="border-2 border-primary/40 px-2 py-1 font-display text-[10px] tracking-widest text-text/70 hover:border-primary hover:text-primary"
                >
                  REMOVE
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReorderButton({
  kind,
  supplementId,
  direction,
  disabled,
}: {
  kind: StackKind;
  supplementId: string;
  direction: "up" | "down";
  disabled: boolean;
}) {
  return (
    <form action={moveStackItem}>
      <input type="hidden" name="supplement_id" value={supplementId} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={`Move ${direction}`}
        className="border-2 border-primary/40 px-2 py-1 font-mono text-xs text-text/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-primary/40 disabled:hover:text-text/70"
      >
        {direction === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}

function FavoritesList({ items }: { items: Supplement[] }) {
  return (
    <div className="card-retro">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg tracking-[0.15em]">
          <span aria-hidden>★</span> FAVORITES
        </h3>
        <span className="font-mono text-xs text-text/50">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text/60">No favorites yet.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((s) => (
            <li key={s.id} className="flex items-center gap-1 border-2 border-primary/40 pl-3">
              <Link
                href={`/supplements/${s.id}`}
                className="font-display text-sm text-accent hover:text-primary"
              >
                {s.name}
              </Link>
              <form action={removeFavorite}>
                <input type="hidden" name="supplement_id" value={s.id} />
                <button
                  type="submit"
                  aria-label={`Remove ${s.name} from favorites`}
                  className="px-2 py-1 font-mono text-xs text-text/60 hover:text-primary"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

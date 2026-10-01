import type { OrderStatus, OrderType } from "@cakeshop/types";
import type { Actor, Transition, TransitionContext } from "./context";
import { GUARDS } from "./guards";
import { ORDER_TRANSITIONS } from "./transitions";

export type TransitionResult = { ok: true; transition: Transition } | { ok: false; reason: string };

export function availableTransitions(from: OrderStatus, orderType: OrderType): Transition[] {
  return ORDER_TRANSITIONS.filter((tr) => tr.from === from && tr.orderTypes.includes(orderType));
}

/**
 * Checks role + guards for a requested transition. Pure: the API calls this, then persists
 * the status change and runs `transition.sideEffects`. The UI may call it to hide actions,
 * but the server decision is authoritative.
 */
export function evaluateTransition(
  from: OrderStatus,
  to: OrderStatus,
  actor: Actor,
  ctx: TransitionContext,
): TransitionResult {
  const transition = ORDER_TRANSITIONS.find(
    (tr) => tr.from === from && tr.to === to && tr.orderTypes.includes(ctx.orderType),
  );
  if (!transition) return { ok: false, reason: `Cannot move a ${ctx.orderType} order from ${from} to ${to}.` };
  if (!transition.allowedRoles.includes(actor)) return { ok: false, reason: `Role "${actor}" is not allowed to perform this action.` };
  for (const id of transition.guards) {
    const failure = GUARDS[id](ctx);
    if (failure) return { ok: false, reason: failure };
  }
  return { ok: true, transition };
}

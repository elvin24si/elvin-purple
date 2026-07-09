// src/lib/promoStore.js
// Supabase-backed store for marketing promos and featured catalog ordering.

const SUPABASE_URL = "https://soprsnuiqltjurhqcwli.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_Fx-MYwIfhybl2KZt7jXv_g_QLQp36Y0";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// ─── PROMOS ──────────────────────────────────────────────────────────────────

/** Fetch all promos, newest first */
export async function getPromos() {
  const res = await fetch(`${SUPABASE_URL}/promos?order=created_at.desc`, {
    method: "GET",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to fetch promos: ${res.statusText}`);
  return res.json();
}

/** Insert a new promo row */
export async function addPromo(data) {
  const payload = {
    title:             data.title,
    subtitle:          data.subtitle || null,
    type:              data.type,
    color:             data.color,
    text_color:        data.textColor,   // map camelCase → snake_case column
    cta_label:         data.cta_label || null,
    linked_product_id: data.linked_product_id || null,
    active:            data.active ?? true,
  };
  const res = await fetch(`${SUPABASE_URL}/promos`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Insert failed: ${res.statusText}`);
  }
  return res.json();
}

/** Toggle active / paused */
export async function updatePromo(id, patch) {
  // Map textColor → text_color if present
  const body = { ...patch };
  if ("textColor" in body) { body.text_color = body.textColor; delete body.textColor; }

  const res = await fetch(
    `${SUPABASE_URL}/promos?id=eq.${encodeURIComponent(id)}`,
    { method: "PATCH", headers, body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Update failed: ${res.statusText}`);
  }
  return res.json();
}

/** Hard-delete a promo */
export async function deletePromo(id) {
  const res = await fetch(
    `${SUPABASE_URL}/promos?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Delete failed: ${res.statusText}`);
  }
  return true;
}

// ─── FEATURED ORDER ───────────────────────────────────────────────────────────

/**
 * Returns the ordered array of product_ids from the singleton featured_order row.
 * @returns {Promise<string[]>}
 */
export async function getFeaturedOrder() {
  const res = await fetch(`${SUPABASE_URL}/featured_order?id=eq.1`, {
    method: "GET",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to fetch featured order: ${res.statusText}`);
  const rows = await res.json();
  return rows[0]?.product_ids ?? [];
}

/**
 * Overwrites the singleton row with a new ordered array.
 * @param {string[]} orderedIds
 */
export async function saveFeaturedOrder(orderedIds) {
  const res = await fetch(`${SUPABASE_URL}/featured_order?id=eq.1`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ product_ids: orderedIds, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Save featured order failed: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Applies the featured ordering to a list of catalog items.
 * Featured items are moved to the top in their specified order.
 * Non-featured items follow in their original order.
 * Only applies when isDefault is true (no active search/filter).
 *
 * @param {Array}    items     - normalizePC'd items
 * @param {boolean}  isDefault - true when catalog is in default/unfiltered state
 * @param {string[]} order     - ordered product_id array from getFeaturedOrder()
 * @returns {Array}
 */
export function applyFeaturedOrder(items, isDefault, order = []) {
  if (!isDefault || order.length === 0) return items;

  const featuredMap = new Map(order.map((id, idx) => [id, idx]));
  const featured = [];
  const rest = [];

  items.forEach((item) => {
    const itemId = item.id ?? item.product_id;
    if (featuredMap.has(itemId)) {
      featured.push({ item, rank: featuredMap.get(itemId) });
    } else {
      rest.push(item);
    }
  });

  featured.sort((a, b) => a.rank - b.rank);
  return [...featured.map((f) => f.item), ...rest];
}

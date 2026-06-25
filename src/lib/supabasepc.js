// src/lib/supabasepc.js
// Centralized Supabase REST API client for WhiteFrame Labs

const SUPABASE_URL = "https://soprsnuiqltjurhqcwli.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_Fx-MYwIfhybl2KZt7jXv_g_QLQp36Y0";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

// --- READ: Fetch all rows from pc_catalog ---
export async function fetchPCCatalog() {
  const res = await fetch(`${SUPABASE_URL}/pc_catalog?order=product_id.asc`, {
    method: "GET",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to fetch catalog: ${res.statusText}`);
  return res.json();
}

// --- CREATE: Insert a new product row ---
export async function insertPC(data) {
  const res = await fetch(`${SUPABASE_URL}/pc_catalog`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Insert failed: ${res.statusText}`);
  }
  return res.json();
}

// --- UPDATE: Patch an existing row by product_id ---
export async function updatePC(productId, data) {
  const res = await fetch(
    `${SUPABASE_URL}/pc_catalog?product_id=eq.${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Update failed: ${res.statusText}`);
  }
  return res.json();
}

// --- DELETE: Remove a row by product_id ---
export async function deletePC(productId) {
  const res = await fetch(
    `${SUPABASE_URL}/pc_catalog?product_id=eq.${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
      headers: { ...headers, Prefer: "return=minimal" },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Delete failed: ${res.statusText}`);
  }
  return true;
}

/**
 * normalizePC: Maps the flat Supabase row shape into the nested shape
 * that PCCard and InventoryRow expect. This keeps all component changes minimal.
 *
 * Supabase row shape:
 *   product_id, name, category, product_img_url, retail_price_idr,
 *   component_cogs_idr, labor_cost_idr, total_unit_cost, net_profit_idr,
 *   gross_margin, cpu_brand, cpu_model, gpu_brand, gpu_model, ram_specs,
 *   cooler_type, availability, target_performance
 */
export function normalizePC(row) {
  return {
    // Identity
    id: row.product_id,
    name: row.name,
    category: row.category ?? "Standard",
    image: row.product_img_url ?? "https://placeholder.com/default-pc.png",
    tags: row.category ? [row.category] : [],

    // Pricing (keep raw IDR value; display formatting is in the component)
    price: row.retail_price_idr ?? 0,

    // Financials (passed through raw for Inventory admin view)
    financials: {
      cogs: row.component_cogs_idr ?? 0,
      labor: row.labor_cost_idr ?? 0,
      totalCost: row.total_unit_cost ?? 0,
      netProfit: row.net_profit_idr ?? 0,
      grossMargin: row.gross_margin ?? 0,
    },

    // Specifications
    specs: {
      cpu: [row.cpu_brand, row.cpu_model].filter(Boolean).join(" "),
      gpu: [row.gpu_brand, row.gpu_model].filter(Boolean).join(" "),
      ram: row.ram_specs ?? "—",
    },

    // Thermals / Cooling
    thermals: {
      cooler: row.cooler_type ?? "—",
      type: row.cooler_type ?? "—",
      fanCount: null,
    },

    // Meta / Logistics
    meta: {
      availability: row.availability ?? "Unknown",
      warranty: "—",
      buildTime: "—",
    },

    // Extra
    targetPerformance: row.target_performance ?? "",

    // Keep original raw row for edit forms
    _raw: row,
  };
}

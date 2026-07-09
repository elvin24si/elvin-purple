// src/lib/supabasemem.js
// Centralized Supabase REST API client for WhiteFrame Labs

const SUPABASE_URL = "https://soprsnuiqltjurhqcwli.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_Fx-MYwIfhybl2KZt7jXv_g_QLQp36Y0";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

// --- READ: Fetch all rows from members ---
export async function fetchMember() {
  const res = await fetch(`${SUPABASE_URL}/members?order=member_id.asc`, {
    method: "GET",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to fetch members: ${res.statusText}`);
  return res.json();
}

// --- CREATE: Insert a new member row ---
export async function insertMember(data) {
  const res = await fetch(`${SUPABASE_URL}/members`, {
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

// --- UPDATE: Patch an existing row by member_id ---
export async function updateMember(memberId, data) {
  const res = await fetch(
    `${SUPABASE_URL}/members?member_id=eq.${encodeURIComponent(memberId)}`,
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

// --- DELETE: Remove a row by member_id ---
export async function deleteMember(memberId) {
  const res = await fetch(
    `${SUPABASE_URL}/members?member_id=eq.${encodeURIComponent(memberId)}`,
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
 * normalizeMember: Maps the flat Supabase row shape into the nested shape
 * that MemberCard and InventoryRow expect. This keeps all component changes minimal.
 *
 * Supabase row shape:
 *   member_id, username, email, password, role, avatar_url, current_points, lifetime_points_earned, times_ordered, total_spent_idr, join_date, last_order_date
 */
export function normalizeMember(row) {
  return {
    // Identity
    member_id: row.member_id,
    username: row.username,
    password: row.password,
    email: row.email,
    role: row.role,
    avatar_url: row.avatar_url,
    current_points: row.current_points,
    lifetime_points_earned: row.lifetime_points_earned,
    times_ordered: row.times_ordered,
    total_spent_idr: row.total_spent_idr,
    join_date: row.join_date,
    last_order_date: row.last_order_date,
  };
}

// --- AUTH: Validate login credentials and fetch matching user profile ---
export async function verifyLogin(email, password) {
  // Query members where email matches exactly
  const url = `${SUPABASE_URL}/members?email=eq.${encodeURIComponent(email.trim())}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) throw new Error("Authentication request failed.");

  const users = await res.json();

  if (!users || users.length === 0) {
    throw new Error("No account found with this email address.");
  }

  const matchedUser = users[0];

  // Plaintext password comparison check
  if (matchedUser.password !== password) {
    throw new Error("Invalid password. Please try again.");
  }

  return matchedUser;
}

// --- AUTH: Check if a given email is already taken inside the sandboxed database ---
export async function checkEmailExists(email) {
  const url = `${SUPABASE_URL}/members?email=eq.${encodeURIComponent(email.trim())}`;
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) return false;
  const data = await res.json();
  return data && data.length > 0;
}

// --- CUSTOM CONSULTATION: Post a new custom consultation request ---
export async function insertConsultation(data) {
  const res = await fetch(`${SUPABASE_URL}/custom_consultations`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Consultation request failed: ${res.statusText}`);
  }
  return res.json();
}

// --- CUSTOM COMMISSIONS: Post a new custom commission request ---
export async function insertCommission(data) {
  const res = await fetch(`${SUPABASE_URL}/custom_commissions`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Commission request failed: ${res.statusText}`);
  }
  return res.json();
}

// --- CUSTOM COMMISSIONS: Fetch all commission requests ---
export async function fetchCommissions() {
  const res = await fetch(`${SUPABASE_URL}/custom_commissions?order=created_at.desc`, {
    method: "GET",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to fetch commissions: ${res.statusText}`);
  return res.json();
}

// --- CUSTOM COMMISSIONS: Fetch member commission requests ---
export async function fetchMemberCommissions(memberId) {
  const res = await fetch(
    `${SUPABASE_URL}/custom_commissions?member_id=eq.${encodeURIComponent(memberId)}&order=created_at.desc`,
    {
      method: "GET",
      headers,
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch member commissions: ${res.statusText}`);
  return res.json();
}

// --- CUSTOM COMMISSIONS: Update a commission row ---
export async function updateCommission(id, data) {
  const res = await fetch(
    `${SUPABASE_URL}/custom_commissions?id=eq.${encodeURIComponent(id)}`,
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

// --- CUSTOM COMMISSIONS: Delete a commission row ---
export async function deleteCommission(id) {
  const res = await fetch(
    `${SUPABASE_URL}/custom_commissions?id=eq.${encodeURIComponent(id)}`,
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
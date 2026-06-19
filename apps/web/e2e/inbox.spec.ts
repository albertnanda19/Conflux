import { test, expect } from '@playwright/test'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.locator('input[type=email]').fill('admin@test.com')
  await page.locator('input[type=password]').fill('password123')
  await page.locator('button:has-text("Masuk")').click()
  await expect(page).toHaveURL(/\/$|\/inbox/, { timeout: 10000 })
}

test('login → inbox memuat percakapan dari backend (bukan mock)', async ({ page }) => {
  await login(page)
  await page.goto('/inbox')
  await page.waitForLoadState('networkidle')

  // Inbox header + minimal satu percakapan dari data seed
  await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible()
  await expect(page.getByText('Rina Sari').first()).toBeVisible({ timeout: 10000 })
})

test('buka percakapan → panel chat + pesan termuat dari API', async ({ page }) => {
  await login(page)
  await page.goto('/inbox')
  await page.waitForLoadState('networkidle')

  await page.getByText('Rina Sari').first().click()
  // Input chat muncul = panel chat terbuka
  await expect(page.locator('textarea[placeholder="Ketik pesan..."]')).toBeVisible({ timeout: 10000 })
  // Minimal satu bubble pesan termuat (seed conv1 punya histori)
  await expect(page.locator('.whitespace-pre-wrap').first()).toBeVisible({ timeout: 10000 })
})

test('filter channel + search tidak error', async ({ page }) => {
  await login(page)
  await page.goto('/inbox')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: 'WA', exact: true }).click()
  await page.waitForTimeout(500)
  await page.locator('input[placeholder="Cari percakapan..."]').fill('Rina')
  await page.waitForTimeout(800)
  await expect(page.getByText('Rina Sari').first()).toBeVisible({ timeout: 10000 })
})

test('filter status & tanggal dikirim sebagai query param ke backend', async ({ page }) => {
  await login(page)
  await page.goto('/inbox')
  await page.waitForLoadState('networkidle')

  const statusReq = page.waitForRequest((r) => r.url().includes('/conversations') && r.url().includes('status=open'))
  await page.getByRole('button', { name: /^Status/ }).click()
  await page.getByRole('button', { name: 'Open', exact: true }).click()
  await statusReq

  const dateReq = page.waitForRequest((r) => r.url().includes('/conversations') && r.url().includes('datePreset=7d'))
  await page.getByRole('button', { name: /Tanggal|Hari/ }).first().click()
  await page.getByText('7 Hari Terakhir').click()
  await dateReq
})

test('ganti presence memanggil PATCH /users/me/status', async ({ page }) => {
  await login(page)
  await page.goto('/inbox')
  await page.waitForLoadState('networkidle')

  const presenceReq = page.waitForRequest(
    (r) => r.url().includes('/users/me/status') && r.method() === 'PATCH',
  )
  await page.locator('header button').filter({ hasText: /Online|Sibuk|Offline/ }).first().click()
  await page.getByText('Sibuk').last().click()
  await presenceReq
})

test('badge notif muncul realtime di halaman non-inbox lalu hilang saat bell dibuka', async ({ page }) => {
  // Login sebagai agent (sari) agar bisa terima notif assignment yang ditujukan ke dirinya.
  await page.goto('/login')
  await page.locator('input[type=email]').fill('sari@test.com')
  await page.locator('input[type=password]').fill('password123')
  await page.locator('button:has-text("Masuk")').click()
  await expect(page).toHaveURL(/\/$|\/inbox/, { timeout: 10000 })

  await page.evaluate(async () => {
    const tok = document.cookie.match(/access_token=([^;]+)/)?.[1]
    if (tok) await fetch('/api/v1/notifications/read-all', { method: 'POST', headers: { Authorization: `Bearer ${decodeURIComponent(tok)}` } })
  })
  await page.goto('/contacts')
  await page.waitForLoadState('networkidle')
  const badge = page.locator('button[title="Notifikasi"] span.bg-coral')

  // Assign sebuah percakapan ke diri sendiri → memicu notif new_assignment (deterministik, lepas dari auto-assign).
  await page.evaluate(async () => {
    const tok = decodeURIComponent(document.cookie.match(/access_token=([^;]+)/)?.[1] || '')
    const h = { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }
    const me = (await (await fetch('/api/v1/users/agents', { headers: h })).json()).data.find((a: { name: string }) => a.name === 'Sari Dewi')
    const convs = (await (await fetch('/api/v1/conversations?limit=1', { headers: h })).json()).data.data
    await fetch(`/api/v1/conversations/${convs[0].id}/assign`, { method: 'PATCH', headers: h, body: JSON.stringify({ agentId: me.id }) })
  })
  await expect(badge).toBeVisible({ timeout: 8000 })

  await page.locator('button[title="Notifikasi"]').click()
  await expect(badge).toHaveCount(0, { timeout: 8000 })
})

test('halaman channels memuat dari backend (GET /channels) + badge terhubung', async ({ page }) => {
  await login(page)
  const channelsReq = page.waitForRequest((r) => r.url().includes('/api/v1/channels') && r.method() === 'GET')
  await page.goto('/channels')
  await channelsReq
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Integrasi Channel')).toBeVisible()
  await expect(page.getByText('Terhubung').first()).toBeVisible({ timeout: 10000 })
})

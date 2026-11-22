/**
 * EcoPulse v3 — Service Worker
 * キャッシュ戦略:
 *   - アプリ本体 (index.html, manifest, icons): Cache-first + バックグラウンド更新
 *   - CDN ライブラリ (Tailwind, Lucide 等): Cache-first (長期キャッシュ)
 *   - 外部プロキシ / RSS / API リクエスト: ネットワーク専用 (キャッシュしない)
 */

const CACHE_VERSION = 'v10-gist-sync';
const CACHE_NAME = `ecopulse-${CACHE_VERSION}`;

// インストール時に事前キャッシュするファイル
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
];

// キャッシュしない動的ホスト（通信が必須のサービス）
const DYNAMIC_HOSTS = [
  'allorigins.win',
  'api.allorigins.win',
  'rss2json.com',
  'corsproxy.io',
  'api.github.com',
  'githubusercontent.com',
];

// ─── Install ──────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache failed:', err))
  );
});

// ─── Activate ─────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating, clearing old caches');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // GET のみ処理
  if (event.request.method !== 'GET') return;

  let url;
  try {
    url = new URL(event.request.url);
  } catch (_) {
    return;
  }

  // ① 動的ホスト → キャッシュせずブラウザに任せる
  if (DYNAMIC_HOSTS.some(h => url.hostname.includes(h))) {
    return; // fall through to network
  }

  // ② 同一オリジン（アプリ本体）→ Cache-first + バックグラウンド更新
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          // バックグラウンドでネットワーク取得して更新
          const networkUpdate = fetch(event.request)
            .then(res => {
              if (res && res.ok) cache.put(event.request, res.clone());
              return res;
            })
            .catch(() => null);

          // キャッシュがあればすぐ返す、なければネットワーク待ち
          return cached || networkUpdate;
        })
      )
    );
    return;
  }

  // ③ CDN（外部スクリプト・フォント）→ Cache-first
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(res => {
            if (res && res.ok) {
              cache.put(event.request, res.clone());
            }
            return res;
          })
          .catch(() => {
            // オフライン時はキャッシュがなければ503
            return new Response('Offline: resource not cached.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
    )
  );
});

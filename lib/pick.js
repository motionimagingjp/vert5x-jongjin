// 次に投稿する1件を選ぶ（純粋関数・テスト可能）
export const CATEGORIES = ['stage', 'home', 'out', 'studio'];

export function nextCategory(last) {
  const i = CATEGORIES.indexOf(last);
  return CATEGORIES[(i + 1) % CATEGORIES.length];
}

// usedAt: { [id]: 投稿時刻ms }。未投稿を定義順に優先し、全部使ったら一番古いものから再利用
export function orderCandidates(posts, category, usedAt, month) {
  return posts
    .filter((p) => p.category === category)
    .filter((p) => !p.months || p.months.includes(month))
    .map((p, i) => ({ p, i, t: usedAt[p.id] ? Number(usedAt[p.id]) : 0 }))
    .sort((a, b) => a.t - b.t || a.i - b.i)
    .map((x) => x.p);
}

export function remainingUnused(posts, category, usedAt) {
  return posts.filter((p) => p.category === category && !usedAt[p.id]).length;
}

// 同じ画像を2周目以降に使う時、前回と同じ文言にならないよう選ぶ
// lastIndex: 直前にこの投稿で使ったバリアントのindex（未使用ならundefined）
export function pickVariant(post, lastIndex, rand = Math.random) {
  const variants = post.variants || [post]; // 後方互換: variantsが無い古い形式もそのまま使えるように
  if (variants.length === 1) return { index: 0, variant: variants[0] };
  const candidates = variants.map((_, i) => i).filter((i) => i !== lastIndex);
  const index = candidates[Math.floor(rand() * candidates.length)];
  return { index, variant: variants[index] };
}

export function buildCaption(variant, weatherLine) {
  const body = weatherLine ? `${weatherLine}\n${variant.ig}` : variant.ig;
  return variant.tags ? `${body}\n\n${variant.tags}` : body;
}

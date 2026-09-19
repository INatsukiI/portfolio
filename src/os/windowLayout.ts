// ウィンドウの初期配置・リサイズで共通して使うサイズ制約ロジック。
// OSScene.tsx から分離し、純粋関数としてユニットテスト可能にする。
//
// 背景（issue #120）: `compact`（縦 1 カラム表示）の閾値は幅 720px だが、
// WIN_DEFAULTS のウィンドウ幅は固定値のため、720〜1000px 幅の通常デスクトップ
// 表示では起動直後のウィンドウが左のアイコン列・右上の SYSTEM パネルと
// 大きく重なってしまう。ここではその重なりを避けるための上限サイズ・
// 配置可能領域（帯）を計算する。

/** ウィンドウの最小幅・最小高さ */
export const MIN_W = 280
export const MIN_H = 180

/** 左のデスクトップアイコン列と重ならないよう確保する幅（非 compact 時のみ） */
export const SIDEBAR_W = 160
/** SYSTEM パネル（w-52 = 208px）+ 右マージン（right-3 = 12px）分として確保する幅 */
export const SYSTEM_PANEL_RESERVE = 208 + 12
/** SYSTEM パネルを表示する最小コンテナ幅。未満では非表示にして重なりを避ける */
export const SYSTEM_PANEL_MIN_CW = 900

export function topBarHeight(compact: boolean): number {
  return compact ? 36 : 40
}

export function bottomBarHeight(compact: boolean): number {
  return compact ? 48 : 44
}

/** SYSTEM パネルを表示するか（compact では非表示。900px 未満でも非表示にして重なりを避ける） */
export function isSystemPanelVisible(cw: number, compact: boolean): boolean {
  return !compact && cw >= SYSTEM_PANEL_MIN_CW
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/** 幅・高さを [MIN_W, maxW] / [MIN_H, maxH] にクランプする */
export function clampSize(w: number, h: number, maxW: number, maxH: number): { w: number; h: number } {
  return { w: clamp(w, MIN_W, maxW), h: clamp(h, MIN_H, maxH) }
}

export interface WindowOpenBand {
  /** ウィンドウ左端 x 座標の下限（アイコン列を避けるための余白） */
  leftBound: number
  /** ウィンドウ右端 x 座標の上限（表示中の SYSTEM パネルを避けるための余白） */
  rightBound: number
  /** 新規に開くウィンドウの最大幅 */
  maxW: number
  /** 新規に開くウィンドウの最大高さ */
  maxH: number
}

/**
 * ウィンドウを新規に開く際、左のアイコン列・（表示時は）右の SYSTEM パネルと
 * 大きく重ならない配置可能領域（帯）と上限サイズを求める。
 */
export function initialWindowBand(cw: number, ch: number, compact: boolean, edge = 16): WindowOpenBand {
  const leftBound = (compact ? 0 : SIDEBAR_W) + edge
  const panelReserve = isSystemPanelVisible(cw, compact) ? SYSTEM_PANEL_RESERVE : 0
  const rightBound = Math.max(leftBound, cw - panelReserve - edge)
  const maxW = Math.max(MIN_W, rightBound - leftBound)
  const maxH = Math.max(MIN_H, ch - topBarHeight(compact) - bottomBarHeight(compact) - edge)
  return { leftBound, rightBound, maxW, maxH }
}

/** ドラッグでリサイズする際の幅・高さの上限（画面内に収まる範囲）。 */
export function resizeWindowMaxSize(cw: number, ch: number, compact: boolean, edge = 8): { maxW: number; maxH: number } {
  const maxW = Math.max(MIN_W, cw - edge * 2)
  const maxH = Math.max(MIN_H, ch - bottomBarHeight(compact))
  return { maxW, maxH }
}

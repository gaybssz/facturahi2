// Shim for platforms without an iOS-style blur tab bar; return null (safe component).
export default function TabBarBackground() {
  return null;
}

export function useBottomTabOverflow() {
  return 0;
}

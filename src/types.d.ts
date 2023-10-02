declare global {
  interface WindowEventMap {
    gamepadbuttondown: CustomEvent<{ buttonNumber: number }>
    gamepadbuttonup: CustomEvent<{ buttonNumber: number }>
    joystickmove: CustomEvent<{ index: number; value: number }>
  }
}
export {}

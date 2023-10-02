# React useGamepad

A very simple library for using the Gamepad API. The Gamepad API expects the consumer to poll its state constantly. While this is useful for games, where you want granular control over user interaction, it doesn't make for very easy to implement HMIs.

This library takes care of the polling for you and just emits events, as if you were interacting with a mouse or keyboard in the browser.

## Installation

`yarn add react-use-gamepad`

## Use

1. Add `<GamepadEventDispatcher/>` at the root of your app. This is where the polling occurs and events are emitted.
2. Import `useGamepad()` to hook into the Gamepad's events

### Example

```tsx
const Page = () => {
  const ref = useRef<HTMLParagraphElement>(null)

  const toast = useToast({
    position: 'top',
    isClosable: true,
    duration: 1000,
  })
  useGamepad({
    onButtonDown: (buttonNumber) => {
      if (ref.current) {
        ref.current.innerHTML = `${buttonNumber}<br/>${ref.current.innerHTML}`
      }
    },
  })

  return (
    <div>
      <p ref={ref} />
      <GamepadEventDispatcher />
    </div>
  )
}

export default testpage
```

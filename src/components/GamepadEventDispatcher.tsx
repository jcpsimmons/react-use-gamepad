import { useEffect, useRef } from 'react'

export default function GamepadEventDispatcher() {
  const gameLoopRef = useRef<number | null>(null)
  const gamepadConnectedRef = useRef<boolean>(false)
  const gamepadRef = useRef<Gamepad | null>(null)

  const sendButtonEvent = (buttonNum: number, lastVal: boolean, curVal: boolean) => {
    const eventName = !lastVal && curVal ? 'gamepadbuttondown' : 'gamepadbuttonup'

    const event = new CustomEvent(eventName, {
      detail: { buttonNumber: buttonNum },
    })

    window.dispatchEvent(event)
  }

  const sendJoystickEvent = (index: number, value: number) => {
    const event = new CustomEvent('joystickmove', {
      detail: {
        index,
        value,
      },
    })

    window.dispatchEvent(event)
  }

  const gameLoop = (index: number) => {
    const gamepads = navigator.getGamepads()
    const gp = gamepads?.[index]

    if (!gp) return

    if (gamepadRef.current) {
      gamepadRef.current.buttons.forEach((button, i) => {
        const lastVal = button.pressed
        const curVal = gp.buttons[i].pressed
        if (lastVal !== curVal) sendButtonEvent(i, lastVal, curVal)
      })

      gamepadRef.current.axes.forEach((axis, i) => {
        sendJoystickEvent(i, axis)
      })
    }

    gamepadRef.current = gp
    gameLoopRef.current = requestAnimationFrame(() => gameLoop(index))
  }

  useEffect(() => {
    const handleGamepadConnected = ({ gamepad: { index } }: GamepadEvent) => {
      gamepadRef.current = navigator.getGamepads()[index]
      if (gamepadRef.current) gameLoop(index)
    }

    const handleGamepadDisconnected = () => {
      gamepadRef.current = null
      gamepadConnectedRef.current = false
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }

    window.addEventListener('gamepadconnected', handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected)
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected)

      if (gamepadConnectedRef.current) {
        handleGamepadDisconnected()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

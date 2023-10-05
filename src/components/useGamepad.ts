import { useEffect, useRef, useState } from 'react'

interface useGamepadArgs {
  onButtonDown?: (buttonNumber: number) => void
  onButtonUp?: (buttonNumber: number) => void
  onJoystickMove?: (index: number, value: number) => void
  dependencies?: any[]
}

export const useGamepad = ({ onButtonDown, onButtonUp, onJoystickMove, dependencies }: useGamepadArgs) => {
  const [gamepadAxes, setGamepadAxes] = useState<readonly number[]>([])
  const isInitialized = useRef(false)

  const deps = dependencies ? dependencies : []

  useEffect(() => {
    if (!isInitialized.current) {
      !!onButtonDown &&
        window.addEventListener('gamepadbuttondown', ({ detail: { buttonNumber } }) => {
          onButtonDown(buttonNumber)
        })
      !!onButtonUp &&
        window.addEventListener('gamepadbuttonup', ({ detail: { buttonNumber } }) => {
          onButtonUp(buttonNumber)
        })
      !!onJoystickMove &&
        window.addEventListener('joystickmove', ({ detail: { index, value } }) => {
          onJoystickMove(index, value)
        })
      isInitialized.current = true
    }

    return () => {
      !!onButtonDown &&
        window.removeEventListener('gamepadbuttondown', ({ detail: { buttonNumber } }) => {
          onButtonDown(buttonNumber)
        })
      !!onButtonUp &&
        window.removeEventListener('gamepadbuttonup', ({ detail: { buttonNumber } }) => {
          onButtonUp(buttonNumber)
        })
      !!onJoystickMove &&
        window.removeEventListener('joystickmove', ({ detail: { index, value } }) => {
          onJoystickMove(index, value)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onButtonDown, onButtonUp, onJoystickMove, ...deps])

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

      const axes = gamepadRef.current.axes
      setGamepadAxes(axes)
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

  return gamepadAxes
}

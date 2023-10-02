import { useEffect, useRef } from 'react'

interface useGamepadArgs {
  onButtonDown?: (buttonNumber: number) => void
  onButtonUp?: (buttonNumber: number) => void
  onJoystickMove?: (index: number, value: number) => void
}

export const useGamepad = ({ onButtonDown, onButtonUp, onJoystickMove }: useGamepadArgs) => {
  const isInitialized = useRef(false)

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
  }, [onButtonDown, onButtonUp, onJoystickMove])

  return
}

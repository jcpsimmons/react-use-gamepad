import { useEffect } from 'react'

interface useGamepadArgs {
  onButtonDown?: (x: any) => void
  onButtonUp?: () => void
  onJoystickMove?: (x: any) => void
}

export const useGamepad = ({ onButtonDown, onButtonUp, onJoystickMove }: useGamepadArgs) => {
  useEffect(() => {
    !!onButtonDown && window.addEventListener('gamepadbuttondown', onButtonDown)
    !!onButtonUp && window.addEventListener('gamepadbuttonup', onButtonUp)
    !!onJoystickMove && window.addEventListener('joystickmove', onJoystickMove)

    return () => {
      !!onButtonDown && window.removeEventListener('gamepadbuttondown', onButtonDown)
      !!onButtonUp && window.removeEventListener('gamepadbuttonup', onButtonUp)
      !!onJoystickMove && window.removeEventListener('joystickmove', onJoystickMove)
    }
  }, [onButtonDown, onButtonUp, onJoystickMove])

  return
}

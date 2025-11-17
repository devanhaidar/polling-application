import { useState, useEffect, useRef } from 'react'
import useSound from 'use-sound'

export const useAudioPlayer = (soundUrl, options = {}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(options.volume || 0.5)
  const [isMuted, setIsMuted] = useState(false)

  const [play, { stop }] = useSound(soundUrl, {
    volume: isMuted ? 0 : volume,
    loop: options.loop || false,
    onend: () => setIsPlaying(false)
  })

  const togglePlay = () => {
    if (isPlaying) {
      stop()
      setIsPlaying(false)
    } else {
      play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const setVolumeLevel = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
  }

  return {
    isPlaying,
    isMuted,
    volume,
    play: togglePlay,
    stop,
    toggleMute,
    setVolume: setVolumeLevel
  }
}


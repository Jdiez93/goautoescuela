'use client'

import { useRef } from "react"
import { AnimationOptions, motion, useAnimate } from "framer-motion"
import { debounce } from "lodash"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  className?: string
  onClick?: () => void
}

export function RandomLetterSwapPingPong({
  label,
  reverse = true,
  transition = { type: "spring", duration: 0.8 },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate()
  const blocked = useRef(false)

  const mergeTransition = (transition: AnimationOptions, i: number) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const getShuffledIndices = () =>
    Array.from({ length: label.length }, (_, i) => i).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(
    () => {
      if (blocked.current) return
      blocked.current = true
      const shuffledIndices = getShuffledIndices()
      for (let i = 0; i < label.length; i++) {
        const idx = shuffledIndices[i]
        animate(".letter-" + idx, { y: reverse ? "110%" : "-110%" }, mergeTransition(transition, i))
        animate(".letter-secondary-" + idx, { y: "0%", opacity: 1 }, mergeTransition(transition, i))
      }
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      blocked.current = false
      const shuffledIndices = getShuffledIndices()
      for (let i = 0; i < label.length; i++) {
        const idx = shuffledIndices[i]
        animate(".letter-" + idx, { y: "0%" }, mergeTransition(transition, i))
        animate(".letter-secondary-" + idx, { y: reverse ? "-110%" : "110%", opacity: 0 }, mergeTransition(transition, i))
      }
    },
    100,
    { leading: true, trailing: true }
  )

  // Split into words so wrapping only happens between words, never mid-word.
  // Each letter keeps its global index so the stagger animation is unchanged.
  const words: { letter: string; index: number }[][] = []
  label.split(" ").reduce((offset, word, wi) => {
    words.push(
      word.split("").map((letter, li) => ({ letter, index: offset + li }))
    )
    return offset + word.length + 1 // +1 for the space
  }, 0)

  return (
    <motion.span
      className={`inline relative ${className ?? ""}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {word.map(({ letter, index }) => (
            <span
              className="whitespace-pre relative inline-block overflow-hidden leading-[1.08] align-baseline"
              key={index}
            >
              <motion.span className={`relative block letter-${index}`} style={{ y: "0%" }}>
                {letter}
              </motion.span>
              <motion.span
                className={`absolute left-0 top-0 block pointer-events-none letter-secondary-${index}`}
                aria-hidden
                style={{ y: reverse ? "-110%" : "110%", opacity: 0 }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span> </span>}
        </span>
      ))}
    </motion.span>
  )
}

export const RandomLetterSwapForward = RandomLetterSwapPingPong

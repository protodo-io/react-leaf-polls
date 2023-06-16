import React, { createRef, RefObject, useEffect, useRef, useState } from 'react'
import styles from './MultiplePoll.module.css'
import { animateAnswers, countPercentage, manageVote } from './utils'
import type { Result } from '../../types/result'
import type { Theme } from '../../types/theme'

interface MultiplePollProps {
  question?: string
  results: Result[]
  theme?: Theme
  isVoted?: boolean
  isVotedId?: number
  consensusReachedAt: number
  onVote?(item: Result, results: Result[]): void
  onClick?(item: Result | undefined): void
}

const MultiplePoll = ({
  question,
  results,
  theme,
  onVote,
  onClick,
  isVoted,
  isVotedId
}: MultiplePollProps) => {
  const [voted, setVoted] = useState<boolean>(false)
  const answerRefs = useRef<RefObject<HTMLDivElement>[]>(
    results.map(() => createRef<HTMLDivElement>())
  )

  useEffect(() => {
    if (isVoted) {
      countPercentage(results)
      animateAnswers(results, answerRefs, theme, undefined, isVotedId)
      setVoted(true)
    }
  }, [])

  return (
    <article
      className={styles.container}
      style={{ alignItems: theme?.alignment }}
    >
      {question && (
        <h1
          style={{
            color: theme?.textColor,
            marginBottom: '1rem',
            fontSize: '1.4rem'
          }}
        >
          {question}
        </h1>
      )}
      {results.map((result) => (
        <div
          key={result.id}
          role='button'
          id={'mulAnswer' + result.id}
          className={
            voted ? styles.answer : styles.answer_hover + ' ' + styles.answer
          }
          style={{
            backgroundColor: theme?.backgroundColor
          }}
          onClick={() => {
            if (!voted) {
              setVoted(true)
              manageVote(results, result, answerRefs, theme)
              onVote?.(result, results)
            } else {
              onClick?.(result)
            }
          }}
        >
          <div className={styles.answerInner}>
            <p style={{ color: theme?.answerTextColor }}>{result.text}</p>
          </div>
          {voted && (
            <span style={{ color: theme?.answerPercentageColor }}>
              {result.percentage}%
            </span>
          )}
        </div>
      ))}
    </article>
  )
}

export { MultiplePoll, MultiplePollProps }

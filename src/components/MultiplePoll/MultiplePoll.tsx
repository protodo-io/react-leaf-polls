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
  isSecretPoll: boolean
  whoVotedWhat: React.ComponentType<any>[][]
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
  isVotedId,
  isSecretPoll,
  whoVotedWhat
}: MultiplePollProps) => {
  const [voted, setVoted] = useState<boolean>(false)
  console.log('*** KIGA-LOG => results', results)
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
      {results.map((result, index) => (
        <React.Fragment>
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
                console.log('*** KIGA-LOG =>', 'ON VOTE', result)
                onVote?.(result, results)
              } else {
                onClick?.(result)
              }
            }}
          >
            <div
              ref={answerRefs.current[result.id]}
              className={styles.answerInner}
            >
              <p style={{ color: theme?.answerTextColor }}>{result.text}</p>
              {voted && (
                <span style={{ color: theme?.answerPercentageColor }}>
                  {result.percentage}%
                </span>
              )}
            </div>
          </div>
          {voted && !isSecretPoll && (
            <div className={styles.whoVotedWhatContainer}>
              {whoVotedWhat[index].map((Component, i) => (
                <React.Fragment key={i}>{Component}</React.Fragment>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </article>
  )
}

export { MultiplePoll, MultiplePollProps }

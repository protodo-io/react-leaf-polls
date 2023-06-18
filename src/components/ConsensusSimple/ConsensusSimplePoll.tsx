import React, { RefObject, useEffect, useRef, useState } from 'react'
import styles from './ConsensusSimplePoll.module.css'
import { animateAnswers, countPercentage, manageVote } from './utils'
import type { Result } from '../../types/result'
import type { Theme } from '../../types/theme'

interface ConsensusSimplePollProps {
  question?: string
  results: Result[]
  theme?: Theme
  isVoted?: boolean
  consensusReachedAt: number
  isSecretPoll: boolean
  whoVotedWhat: React.ComponentType<any>[][]
  onVote?(item: Result, results: Result[]): void
  onClick?(item: Result | undefined): void
}

const ConsensusSimplePoll = ({
  question,
  results,
  theme,
  onVote,
  onClick,
  isVoted
}: ConsensusSimplePollProps) => {
  const [voted, setVoted] = useState<boolean>(false)
  const answersContainer = useRef<HTMLDivElement>(null)
  const answer0 = useRef<HTMLDivElement>(null)
  const answer1 = useRef<HTMLDivElement>(null)
  const answer2 = useRef<HTMLDivElement>(null)
  const allRefs: RefObject<HTMLDivElement>[] = [
    answer0,
    answer1,
    answer2,
    answersContainer
  ]

  useEffect(() => {
    if (isVoted) {
      countPercentage(results)
      animateAnswers(results, allRefs, theme)
      setVoted(true)
    }
  }, [])

  const handleVote = (index: number) => {
    if (!voted) {
      setVoted(true)
      manageVote(results, results[index], allRefs)
      onVote?.(results[index], results)
    } else {
      onClick?.(results[index])
    }
  }

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

      <div
        ref={answersContainer}
        className={styles.inner}
        style={{ backgroundColor: theme?.backgroundColor }}
      >
        {results.map((result, index) => (
          <div
            key={index}
            ref={allRefs[index]}
            role='button'
            className={styles.answer_hover + ' ' + styles.answer}
            id={`binAnswer${index}`}
            onClick={() => handleVote(index)}
          >
            <div className={styles.answerContainer}>
              <p
                title={result.text}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {result.text}
              </p>
              {voted && (
                <span style={{ color: theme?.textColor }}>
                  {result.percentage}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export { ConsensusSimplePoll, ConsensusSimplePollProps }

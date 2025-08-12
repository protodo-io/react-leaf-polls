import React, { RefObject, useEffect, useRef, useState } from 'react'
import styles from './BinaryPoll.module.css'
import { animateAnswers, countPercentage, manageVote } from './BinaryPollsUtils'
import type { Result } from '../../types/result'
import type { Theme } from '../../types/theme'

// move to types if iit will be the same as MultiplePollProps
interface BinaryPollProps {
  question?: string
  results: Result[]
  theme?: Theme
  isVoted?: boolean
  consensusReachedAt: number
  isSecretPoll: boolean
  whoVotedWhat: React.ComponentType<any>[][]
  onVote?(item: Result, results: Result[]): void
  onClickAfterVote?(item: Result | undefined): void
}

const BinaryPoll = ({
  question,
  results,
  theme,
  onVote,
  onClickAfterVote,
  isVoted,
  isSecretPoll,
  whoVotedWhat
}: BinaryPollProps) => {
  const [voted, setVoted] = useState<boolean>(false)
  const answersContainer = useRef<HTMLDivElement>(null)
  const answer0 = useRef<HTMLDivElement>(null)
  const answer1 = useRef<HTMLDivElement>(null)
  const allRefs: RefObject<HTMLDivElement>[] = [
    answer0,
    answer1,
    answersContainer
  ]

  useEffect(() => {
    if (isVoted) {
      countPercentage(results)
      animateAnswers(0, results, allRefs, theme)
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

      <div
        ref={answersContainer}
        className={styles.inner}
        style={{ backgroundColor: theme?.backgroundColor }}
      >
        <div
          ref={answer0}
          role='button'
          className={styles.answer_hover + ' ' + styles.answer}
          style={{
            backgroundColor: theme?.leftColor,
            color: theme?.answerTextLeftColor,
            minWidth: '150px'
          }}
          id='binAnswer0'
          onClick={() => {
            if (!voted) {
              setVoted(true)
              manageVote(results, results[0], 0, allRefs)
              onVote?.(results[0], results)
            } else {
              onClickAfterVote?.(results[0])
            }
          }}
        >
          <div className={styles.answerContainer}>
            <p
              title={results[0].text}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {results[0].text}
            </p>
            {voted && (
              <span style={{ color: theme?.answerTextRightColor }}>
                {results[0].percentage}%
              </span>
            )}
          </div>
        </div>
        <div
          ref={answer1}
          role='button'
          className={styles.answer_hover + ' ' + styles.answer}
          style={{
            backgroundColor: theme?.rightColor,
            color: theme?.answerTextRightColor,
            minWidth: '150px'
          }}
          id='binAnswer1'
          onClick={() => {
            if (!voted) {
              setVoted(true)
              manageVote(results, results[1], 1, allRefs)
              onVote?.(results[1], results)
            } else {
              onClickAfterVote?.(results[1])
            }
          }}
        >
          <div className={styles.answerContainer}>
            <p
              title={results[1].text}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {results[1].text}
            </p>
            {voted && (
              <span style={{ color: theme?.answerTextLeftColor }}>
                {results[1].percentage}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.votersList}>
        {voted &&
          !isSecretPoll &&
          whoVotedWhat.map((vote: any, i: number) => (
            <div key={i}>
              <h3 style={{ color: theme?.textColor }}>{results[i].text}:</h3>
              {results[i].votes > 0 ? (
                <div className={styles.votersWrapper}>{vote}</div>
              ) : (
                <div className={styles.votersWrapper}>-</div>
              )}
            </div>
          ))}
      </div>
    </article>
  )
}

export { BinaryPoll }
export type { BinaryPollProps }

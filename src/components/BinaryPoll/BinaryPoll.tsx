import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styles from './BinaryPoll.improved.module.css'
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
  whoVotedWhat,
  consensusReachedAt
}: BinaryPollProps) => {
  const intl = useIntl()
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

  // Calculate statistics
  const totalVotes = results.reduce((sum, result) => sum + result.votes, 0)
  const sortedResults = [...results].sort((a, b) => b.votes - a.votes)
  const winner = sortedResults[0]
  const hasWinner = winner && winner.votes > 0 && totalVotes > 0

  return (
    <article
      className={styles.container}
      style={{ alignItems: theme?.alignment }}
    >
      {question && (
        <h1 className={styles.question} style={{ color: theme?.textColor }}>
          {question}
        </h1>
      )}

      {/* Statistics Header - nur nach Abstimmung */}
      {voted && (
        <div className={styles.statisticsHeader}>
          <div className={styles.statisticsInfo}>
            <div className={styles.statisticsItem}>
              <span className={styles.statisticsLabel}>
                {' '}
                {intl.formatMessage({ id: 'poll.totalVotes' })}
              </span>
              <span className={styles.statisticsValue}>{totalVotes}</span>
            </div>
            {hasWinner && (
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>
                  {' '}
                  {intl.formatMessage({ id: 'poll.leading' })}
                </span>
                <span className={styles.statisticsValue}>
                  {winner.text} ({winner.percentage}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        ref={answersContainer}
        className={styles.inner}
        style={{ backgroundColor: theme?.backgroundColor }}
      >
        <div
          ref={answer0}
          role='button'
          className={`${styles.answer_hover} ${styles.answer} ${
            voted && hasWinner && results[0].id === winner.id
              ? styles.winner
              : ''
          }`}
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
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!voted) {
                setVoted(true)
                manageVote(results, results[0], 0, allRefs)
                onVote?.(results[0], results)
              } else {
                onClickAfterVote?.(results[0])
              }
            }
          }}
          aria-label={`Option: ${results[0].text}${
            voted
              ? `, ${results[0].votes} Stimmen, ${results[0].percentage}%`
              : ''
          }`}
        >
          <div className={styles.answerContainer}>
            <div className={styles.answerText}>
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
              {voted && hasWinner && results[0].id === winner.id && (
                <span className={styles.winnerBadge}>👑</span>
              )}
            </div>
            {voted && (
              <div className={styles.answerStats}>
                <span className={styles.voteCount}>
                  {intl.formatMessage(
                    { id: 'poll.votes' },
                    { count: results[0].votes }
                  )}
                </span>
                <span
                  className={styles.percentage}
                  style={{ color: theme?.answerTextRightColor }}
                >
                  {results[0].percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div
          ref={answer1}
          role='button'
          className={`${styles.answer_hover} ${styles.answer} ${
            voted && hasWinner && results[1].id === winner.id
              ? styles.winner
              : ''
          }`}
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
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!voted) {
                setVoted(true)
                manageVote(results, results[1], 1, allRefs)
                onVote?.(results[1], results)
              } else {
                onClickAfterVote?.(results[1])
              }
            }
          }}
          aria-label={`Option: ${results[1].text}${
            voted
              ? `, ${results[1].votes} Stimmen, ${results[1].percentage}%`
              : ''
          }`}
        >
          <div className={styles.answerContainer}>
            <div className={styles.answerText}>
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
              {voted && hasWinner && results[1].id === winner.id && (
                <span className={styles.winnerBadge}>👑</span>
              )}
            </div>
            {voted && (
              <div className={styles.answerStats}>
                <span className={styles.voteCount}>
                  {intl.formatMessage(
                    { id: 'poll.votes' },
                    { count: results[1].votes }
                  )}
                </span>
                <span
                  className={styles.percentage}
                  style={{ color: theme?.answerTextLeftColor }}
                >
                  {results[1].percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.votersList}>
        {voted &&
          !isSecretPoll &&
          whoVotedWhat.map((vote: any, i: number) => (
            <div key={i} className={styles.votersSection}>
              <h3
                className={styles.votersOptionTitle}
                style={{ color: theme?.textColor }}
              >
                {results[i].text}:
              </h3>
              {results[i].votes > 0 ? (
                <div className={styles.votersWrapper}>{vote}</div>
              ) : (
                <div
                  className={styles.votersWrapper + ' ' + styles.emptyVoters}
                >
                  -
                </div>
              )}
            </div>
          ))}
      </div>
    </article>
  )
}

export { BinaryPoll }
export type { BinaryPollProps }

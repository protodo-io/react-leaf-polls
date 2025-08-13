import React, { createRef, RefObject, useEffect, useRef, useState } from 'react'
import styles from './MultiplePoll.improved.module.css'
import {
  animateAnswers,
  countPercentage,
  manageVote
} from './MultiplePollUtils'
import type { Result } from '../../types/result'
import type { Theme } from '../../types/theme'
import { useIntl } from 'react-intl'

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
  onClickAfterVote?(item: Result | undefined): void
}

const MultiplePoll = ({
  question,
  results,
  theme,
  onVote,
  onClickAfterVote,
  isVoted,
  isVotedId,
  isSecretPoll,
  whoVotedWhat
}: MultiplePollProps) => {
  const intl = useIntl()
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
                {intl.formatMessage({ id: 'poll.totalVotes' })}
              </span>
              <span className={styles.statisticsValue}>{totalVotes}</span>
            </div>
            {hasWinner && (
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>
                  {' '}
                  {intl.formatMessage({ id: 'poll.winner' })}
                </span>
                <span className={styles.statisticsValue}>
                  {winner.text} ({winner.percentage}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.optionsContainer}>
        {results.map((result, index) => {
          const isWinner = voted && hasWinner && result.id === winner.id
          const textColor =
            result.id === isVotedId ? theme?.answerTextColor : theme?.textColor

          return (
            <React.Fragment key={result.id}>
              <div
                role='button'
                id={'mulAnswer' + result.id}
                className={`${styles.answer} ${
                  voted ? styles.voted : styles.unvoted
                } ${isWinner ? styles.winner : ''}`}
                style={{
                  backgroundColor: !voted ? theme?.backgroundColor : undefined
                }}
                onClick={() => {
                  if (!voted) {
                    setVoted(true)
                    manageVote(results, result, answerRefs, theme)
                    onVote?.(result, results)
                  } else {
                    onClickAfterVote?.(result)
                  }
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (!voted) {
                      setVoted(true)
                      manageVote(results, result, answerRefs, theme)
                      onVote?.(result, results)
                    } else {
                      onClickAfterVote?.(result)
                    }
                  }
                }}
                aria-label={`Option: ${result.text}${
                  voted
                    ? `, ${result.votes} Stimmen, ${result.percentage}%`
                    : ''
                }`}
              >
                <div
                  ref={answerRefs.current[result.id]}
                  className={styles.answerInner}
                >
                  <div className={styles.answerContent}>
                    <div className={styles.answerText}>
                      <span
                        className={styles.answerLabel}
                        style={{ color: voted ? '#ffffff' : textColor }}
                      >
                        {result.text}
                      </span>
                      {isWinner && (
                        <span className={styles.winnerBadge}>👑</span>
                      )}
                    </div>
                    {voted && (
                      <div className={styles.answerStats}>
                        <span className={styles.voteCount}>
                          {intl.formatMessage(
                            { id: 'poll.votes' },
                            { count: result.votes }
                          )}
                        </span>
                        <span
                          className={styles.percentage}
                          style={{
                            color: theme?.answerPercentageColor || '#ffffff'
                          }}
                        >
                          {result.percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                  {voted && (
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {voted && !isSecretPoll && (
                <div className={styles.whoVotedWhatContainer}>
                  {whoVotedWhat[index].map((Component: any, i: number) => (
                    <React.Fragment key={i}>{Component}</React.Fragment>
                  ))}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </article>
  )
}

export { MultiplePoll }
export type { MultiplePollProps }

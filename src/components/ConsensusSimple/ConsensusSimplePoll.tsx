import React, { RefObject, useEffect, useRef, useState } from 'react'
import styles from './ConsensusSimplePoll.improved.module.css'
import {
  animateAnswers,
  countPercentage,
  manageVote
} from './ConsensusSimplePollUtils'
import type { Result } from '../../types/result'
import type { Theme } from '../../types/theme'
import { FormattedMessage, useIntl } from 'react-intl'

interface ConsensusSimplePollProps {
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

const ConsensusSimplePoll = ({
  question,
  results,
  theme,
  onVote,
  onClickAfterVote,
  isVoted,
  consensusReachedAt,
  isSecretPoll,
  whoVotedWhat
}: ConsensusSimplePollProps) => {
  const intl = useIntl()
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
  }, [isVoted, results, allRefs, theme])

  const handleVote = (index: number) => {
    if (!voted) {
      setVoted(true)
      manageVote(results, results[index], allRefs)
      onVote?.(results[index], results)
    } else {
      onClickAfterVote?.(results[index])
    }
  }

  // Berechne Konsens-Status
  const totalVotes = results.reduce((sum, result) => sum + result.votes, 0)
  const maxPercentage = Math.max(...results.map((r) => r.percentage || 0))
  const consensusReached = maxPercentage >= consensusReachedAt
  const leadingOption = results.find((r) => r.percentage === maxPercentage)

  const getUnvotedClass = (index: number) => {
    if (voted) return styles.voted

    switch (index) {
      case 0:
        return styles.unvotedFavor // Zustimmung
      case 1:
        return styles.unvotedAgainst // Ablehnung
      case 2:
        return styles.unvotedAbstain // Enthaltung
      default:
        return styles.unvoted
    }
  }

  return (
    <article
      className={styles.container}
      style={{ alignItems: theme?.alignment }}
      role='group'
      aria-label={`Consensus poll: ${question || 'Choose an option'}`}
    >
      {question && (
        <h1 className={styles.question} style={{ color: theme?.textColor }}>
          {question}
        </h1>
      )}

      {/* Konsens-Status Anzeige */}
      {voted && (
        <div className={styles.consensusStatus}>
          <div className={styles.consensusInfo}>
            <span className={styles.consensusLabel}>
              {intl.formatMessage(
                { id: 'poll.consensus' },
                { threshold: consensusReachedAt }
              )}
            </span>
            <span
              className={`${styles.consensusValue} ${
                consensusReached ? styles.reached : styles.notReached
              }`}
            >
              {consensusReached
                ? intl.formatMessage({ id: 'poll.consensusReached' })
                : `${maxPercentage}% (${intl.formatMessage(
                    { id: 'poll.consensusMissing' },
                    { missing: consensusReachedAt - maxPercentage }
                  )})`}
            </span>
          </div>
          {consensusReached && leadingOption && (
            <div className={styles.consensusResult}>
              <FormattedMessage
                id='poll.consensusResult'
                values={{
                  message: intl.formatMessage({ id: 'poll.consensusFor' }),
                  option: <strong>{leadingOption.text}</strong>
                }}
              />
            </div>
          )}
        </div>
      )}

      <div
        ref={answersContainer}
        className={styles.inner}
        style={{ backgroundColor: theme?.backgroundColor }}
        role='radiogroup'
        aria-label='Poll options'
      >
        {results.map((result, index) => (
          <div
            key={'result-' + index}
            ref={allRefs[index]}
            role='radio'
            aria-checked={voted ? 'true' : 'false'}
            aria-label={`${result.text}${
              voted ? `, ${result.votes} votes, ${result.percentage || 0}%` : ''
            }`}
            className={`${styles.answer} ${getUnvotedClass(index)} ${
              voted && consensusReached && result.percentage === maxPercentage
                ? styles.consensus
                : ''
            }`}
            id={`consensusAnswer${index}`}
            onClick={() => handleVote(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleVote(index)
              }
            }}
            tabIndex={0}
            data-option={
              index === 0 ? 'favor' : index === 1 ? 'against' : 'abstain'
            }
          >
            <div className={styles.answerContainer}>
              <div className={styles.answerText}>
                <span className={styles.answerLabel} title={result.text}>
                  {result.text}
                </span>
                {voted && (
                  <div className={styles.answerStats}>
                    <span className={styles.voteCount}>
                      {intl.formatMessage(
                        { id: 'poll.votes' },
                        { count: result.votes }
                      )}
                    </span>
                    <span className={styles.percentage}>
                      {index !== 2 ? `${result.percentage || 0}%` : ' '}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar für voted state */}
              {voted && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${result.percentage || 0}%`,
                      backgroundColor:
                        index === 0
                          ? '#22c55e'
                          : index === 1
                          ? '#ef4444'
                          : '#6b7280'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Voter Details */}
      {voted && !isSecretPoll && (
        <div
          className={styles.votersList}
          role='region'
          aria-label='Voting details'
        >
          <h3 className={styles.votersTitle}>
            <FormattedMessage id='poll.votingDetails' />:
          </h3>
          {whoVotedWhat.map((vote: any, i: number) => (
            <div key={'voters-' + i} className={styles.votersSection}>
              <h4
                className={styles.votersOptionTitle}
                style={{ color: theme?.textColor }}
              >
                {intl.formatMessage(
                  { id: 'poll.votes' },
                  { count: results[i].votes }
                )}
              </h4>
              <div className={styles.votersWrapper}>
                {results[i].votes > 0 ? (
                  vote
                ) : (
                  <span className={styles.emptyVoters}>
                    {intl.formatMessage({ id: 'poll.noVotes' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export { ConsensusSimplePoll }
export type { ConsensusSimplePollProps }

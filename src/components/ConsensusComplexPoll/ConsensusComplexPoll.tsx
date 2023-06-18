import React, { useEffect, useRef, useState } from 'react'
import styles from './ConsensusComplexPoll.module.css'
import type { Result } from '../../types/result'
import type { Theme } from '../../types/theme'
import { calculateAveragePosition, countPercentage, manageVote } from './utils'

interface ConsensusComplexProps {
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

const ConsensusComplexPoll = ({
  question,
  results,
  theme,
  isVoted,
  onVote,
  onClick,
  isVotedId,
  consensusReachedAt,
  whoVotedWhat,
  isSecretPoll
}: ConsensusComplexProps) => {
  const [voted, setVoted] = useState<boolean>(false)
  // const [average, setAverage] = useState<number>(0)
  const [votedId, setVotedId] = useState<number | null>(-1)
  const consensusReachedAtIndicatorRef = useRef<HTMLDivElement>(null)
  const averageIndicatorRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVotedId) {
      setVotedId(isVotedId)
    }
    if (isVoted) {
      setVoted(true)
      countPercentage(results)
      // setAverage(calculateAverage(results))
    }
  }, [])

  useEffect(() => {
    const amtResults = results.length
    const sliderOffsetWidth = sliderRef.current?.offsetWidth || 0
    const sliderWidth = (sliderOffsetWidth * (amtResults - 1)) / amtResults
    const sliderLeft = sliderRef.current?.offsetLeft || 0
    const handleWidth = consensusReachedAtIndicatorRef.current?.offsetWidth
    if (sliderWidth && handleWidth && consensusReachedAtIndicatorRef.current) {
      const left =
        (consensusReachedAt / 100) * (sliderWidth - handleWidth) +
        handleWidth / 2 +
        sliderLeft // this will convert the percentage to a pixel value relative to the slider's width
      consensusReachedAtIndicatorRef.current.style.left = `${left}px`
    }
  }, [])

  useEffect(() => {
    if (isVoted) {
      countPercentage(results)
      const avg = calculateAveragePosition(results)
      const amtResults = results.length
      const sliderOffsetWidth = sliderRef.current?.offsetWidth || 0
      const sliderWidth = (sliderOffsetWidth * (amtResults - 1)) / amtResults
      const sliderLeft = sliderRef.current?.offsetLeft || 0
      const handleWidth = averageIndicatorRef.current?.offsetWidth

      if (sliderWidth && handleWidth && averageIndicatorRef.current) {
        const percentage = ((avg - 1) / (amtResults - 1)) * 100 // this will give you a percentage relative to the 7 positions
        const left =
          (percentage / 100) * (sliderWidth - handleWidth) +
          handleWidth / 2 +
          0.5 * (sliderWidth / amtResults) +
          sliderLeft
        averageIndicatorRef.current.style.left = `${left}px`
      }
    }
  }, [results, isVoted])

  const handleVote = () => {
    if (!voted) {
      setVoted(true)
      const selectedResult = results.find((r) => r.id === votedId)
      if (selectedResult) {
        manageVote(results, selectedResult)
        onVote?.(selectedResult, results)
      }
    } else {
      const selectedResult = results.find((r) => r.id === votedId)
      onClick?.(selectedResult)
    }
  }

  // @ts-ignore
  return (
    <article
      className={styles.container}
      style={{ alignItems: theme?.alignment }}
    >
      {question && (
        <h1
          style={{
            color: theme?.textColor,
            marginBottom: '3rem',
            fontSize: '1.8rem'
          }}
        >
          {question}
        </h1>
      )}

      <div ref={sliderRef} className={styles.sliderContainer}>
        <div ref={averageIndicatorRef} className={styles.averageIndicator}>
          <span className={styles.averageIndicatorText}>AVG</span>
        </div>
        <div
          ref={consensusReachedAtIndicatorRef}
          className={styles.consensusReachedAtIndicator}
        >
          <span className={styles.consensusReachedAtIndicatorText}>MIN</span>
        </div>
        <input
          type='range'
          min='0'
          max='7'
          value={votedId || -1}
          className={styles.slider}
          disabled={voted}
          onChange={(e) => {
            const selectedId = Number(e.target.value)
            setVotedId(selectedId)
            const selectedResult = results.find((r) => r.id === selectedId)
            if (selectedResult) {
              onClick?.(selectedResult)
            }
          }}
          onMouseUp={() => {
            // handleVote()
          }}
        />
        <div className={styles.labelsContainer}>
          {results.map((option, index) => (
            <div key={index} className={styles.sliderLabelContainer}>
              <div className={styles.voteCount}>{option.percentage} %</div>
              <span
                className={styles.sliderLabel}
                style={{ color: theme?.textColor }}
              >
                {option.text}
              </span>

              {!isSecretPoll &&
                whoVotedWhat[index].map((Component, i) => (
                  <React.Fragment key={i}>{Component}</React.Fragment>
                ))}
            </div>
          ))}
        </div>
        {!voted && (
          <button
            className={`${styles.voteButton} ${
              votedId !== null && votedId >= 0
                ? styles.voteButtonEnabled
                : styles.voteButtonDisabled
            }`}
            onClick={!voted ? handleVote : () => {}}
            disabled={voted}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              style={{
                fill: '#fff'
              }}
              viewBox='0 0 576 512'
            >
              <path d='M96 80c0-26.5 21.5-48 48-48h288c26.5 0 48 21.5 48 48v304H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48h16v128h448V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48v-96z' />
            </svg>
          </button>
        )}
      </div>
    </article>
  )
}

export { ConsensusComplexPoll, ConsensusComplexProps }

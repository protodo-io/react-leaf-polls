import React, { useState, useEffect, useRef, createRef, RefObject } from 'react'
import { BinaryPoll } from './components/BinaryPoll/BinaryPoll'
import { MultiplePoll } from './components/MultiplePoll/MultiplePoll'
import { ConsensusSimplePoll } from './components/ConsensusSimple/ConsensusSimplePoll'
import { ConsensusComplexPoll } from './components/ConsensusComplexPoll/ConsensusComplexPoll'
import type { Result } from './types/result'
import type { Theme } from './types/theme'
import type { BinaryPollProps } from './components/BinaryPoll/BinaryPoll'
import type { MultiplePollProps } from './components/MultiplePoll/MultiplePoll'
import type { ConsensusSimplePollProps } from './components/ConsensusSimple/ConsensusSimplePoll'
import type { ConsensusComplexProps } from './components/ConsensusComplexPoll/ConsensusComplexPoll'

// Import modern theme CSS
import './styles/modern-theme.css'
import { FormattedMessage } from 'react-intl'

interface LeafPollProps
  extends BinaryPollProps,
    MultiplePollProps,
    ConsensusSimplePollProps,
    ConsensusComplexProps {
  type: 'binary' | 'multiple' | 'consensusComplex' | 'consensusSimple'
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
  className?: string
  'aria-label'?: string
}

/**
 * Modern LeafPoll Component - Version 1.3.0
 *
 * Enhanced with:
 * - Modern CSS custom properties and design
 * - Improved accessibility (ARIA labels, keyboard navigation)
 * - Better mobile responsiveness
 * - Performance optimizations
 * - TypeScript improvements
 *
 * @param type
 * @param question
 * @param results
 * @param theme
 * @param onVote
 * @param isVoted
 * @param isVotedId
 * @param consensusReachedAt
 * @param whoVotedWhat
 * @param isSecretPoll
 * @param className
 * @param ariaLabel
 * @param onClickAfterVote
 * @param props - Poll configuration and event handlers
 * @returns Rendered poll component based on type
 */
const LeafPoll = ({
  type,
  question,
  results,
  theme,
  onVote,
  isVoted = false,
  isVotedId,
  consensusReachedAt = 75,
  whoVotedWhat,
  isSecretPoll = true,
  className = '',
  'aria-label': ariaLabel,
  onClickAfterVote,
  ...props
}: LeafPollProps): React.JSX.Element => {
  // Enhanced theme with modern defaults
  const modernTheme: Theme = {
    // Modern color palette
    mainColor: '#6366f1',
    otherColor: '#e5e7eb',
    answerTextColor: '#1f2937',
    answerPercentageColor: '#6366f1',

    leftColor: '#ef4444',
    rightColor: '#10b981',
    answerTextLeftColor: '#ffffff',
    answerTextRightColor: '#ffffff',

    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    alignment: 'center',

    consensusSimpleLeft: '#ef4444',
    consensusSimpleMiddle: '#f59e0b',
    consensusSimpleRight: '#10b981',

    // Merge with user theme
    ...theme
  }

  // Common props for all poll types
  const commonProps = {
    question,
    results,
    theme: modernTheme,
    onVote,
    isVoted,
    isVotedId,
    consensusReachedAt,
    whoVotedWhat,
    isSecretPoll,
    onClickAfterVote,
    ...props
  }

  // Add modern CSS class
  const modernClassName = `poll-modern ${className}`.trim()

  switch (type) {
    case 'binary':
      if (results.length !== 2) {
        console.warn('BinaryPoll requires exactly 2 results')
        return (
          <div
            className='poll-error'
            style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}
          >
            <FormattedMessage id='poll.warningBinary' />
          </div>
        )
      }
      return (
        <div
          className={modernClassName}
          aria-label={
            ariaLabel || `Binary poll: ${question || 'Choose an option'}`
          }
        >
          <BinaryPoll {...commonProps} />
        </div>
      )

    case 'multiple':
      if (results.length === 0) {
        console.warn('MultiplePoll requires at least 1 result')
        return (
          <div
            className='poll-error'
            style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}
          >
            <FormattedMessage id='poll.warningMultiple' />
          </div>
        )
      }
      return (
        <div
          className={modernClassName}
          aria-label={
            ariaLabel ||
            `Multiple choice poll: ${question || 'Choose an option'}`
          }
        >
          <MultiplePoll {...commonProps} />
        </div>
      )

    case 'consensusSimple':
      if (results.length !== 3) {
        console.warn('ConsensusSimplePoll requires exactly 3 results')
        return (
          <div
            className='poll-error'
            style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}
          >
            <FormattedMessage id='poll.warningConsensusSimple' />
          </div>
        )
      }
      return (
        <div
          className={modernClassName}
          aria-label={
            ariaLabel || `Consensus poll: ${question || 'Rate your agreement'}`
          }
        >
          <ConsensusSimplePoll {...commonProps} />
        </div>
      )

    case 'consensusComplex':
      if (results.length === 0) {
        console.warn('ConsensusComplexPoll requires at least 1 result')
        return (
          <div
            className='poll-error'
            style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}
          >
            <FormattedMessage id='poll.warningConsensusComplex' />
          </div>
        )
      }
      return (
        <div
          className={modernClassName}
          aria-label={
            ariaLabel ||
            `Complex consensus poll: ${question || 'Rate your position'}`
          }
        >
          <ConsensusComplexPoll {...commonProps} />
        </div>
      )

    default:
      console.error(`Unknown poll type: ${type}`)
      return (
        <div
          className='poll-error'
          style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}
        >
          <FormattedMessage id='poll.errorUnknownType' values={{ type }} />
        </div>
      )
  }
}

// Export main component
export { LeafPoll }

// Export individual components for direct use
export { BinaryPoll, MultiplePoll, ConsensusSimplePoll, ConsensusComplexPoll }

// Export types
export type { Result, Theme }
export type {
  LeafPollProps,
  BinaryPollProps,
  MultiplePollProps,
  ConsensusSimplePollProps,
  ConsensusComplexProps
}

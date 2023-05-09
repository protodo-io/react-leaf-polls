import React from 'react'
import { BinaryPoll, BinaryPollProps } from './components/BinaryPoll/BinaryPoll'
import {
  MultiplePoll,
  MultiplePollProps
} from './components/MultiplePoll/MultiplePoll'
import { Result } from './types/result'

interface Props extends BinaryPollProps, MultiplePollProps {
  type: 'binary' | 'multiple'
}

const LeafPoll = ({
  type,
  question,
  results,
  theme,
  onVote,
  isVoted = false,
  isVotedId
}: Props) => {
  return type === 'binary' ? (
    <BinaryPoll
      question={question}
      results={results}
      theme={theme}
      onVote={onVote}
      isVoted={isVoted}
    />
  ) : (
    <MultiplePoll
      question={question}
      results={results}
      theme={theme}
      onVote={onVote}
      isVoted={isVoted}
      isVotedId={isVotedId}
    />
  )
}

export { LeafPoll, Result }

import React from 'react'
import { Result } from './types/result'
import { POLL_TYPES } from './types/constants'
import { BinaryPoll, BinaryPollProps } from './components/BinaryPoll/BinaryPoll'
import {
  MultiplePoll,
  MultiplePollProps
} from './components/MultiplePoll/MultiplePoll'
import {
  ConsensusSimplePoll,
  ConsensusSimplePollProps
} from './components/ConsensusSimple/ConsensusSimplePoll'
import {
  ConsensusComplexPoll,
  ConsensusComplexProps
} from './components/ConsensusComplexPoll/ConsensusComplexPoll'

interface Props
  extends BinaryPollProps,
    MultiplePollProps,
    ConsensusSimplePollProps,
    ConsensusComplexProps {
  type: 'binary' | 'multiple' | 'consensusComplex' | 'consensusSimple'
}

const LeafPoll = ({
  type,
  question,
  results,
  theme,
  onVote,
  isVoted = false,
  isVotedId,
  consensusReachedAt
}: Props) => {
  switch (type) {
    case POLL_TYPES.binary:
      return (
        <BinaryPoll
          question={question}
          results={results}
          theme={theme}
          onVote={onVote}
          isVoted={isVoted}
          consensusReachedAt={consensusReachedAt}
        />
      )
    case POLL_TYPES.consensusSimple:
      return (
        <ConsensusSimplePoll
          question={question}
          results={results}
          theme={theme}
          onVote={onVote}
          isVoted={isVoted}
          consensusReachedAt={consensusReachedAt}
        />
      )
    case POLL_TYPES.consensusComplex:
      return (
        <ConsensusComplexPoll
          question={question}
          results={results}
          theme={theme}
          onVote={onVote}
          isVoted={isVoted}
          isVotedId={isVotedId}
          consensusReachedAt={consensusReachedAt}
        />
      )
    case POLL_TYPES.multiple:
    default:
      return (
        <MultiplePoll
          question={question}
          results={results}
          theme={theme}
          onVote={onVote}
          isVoted={isVoted}
          isVotedId={isVotedId}
          consensusReachedAt={consensusReachedAt}
        />
      )
  }
}

export { LeafPoll, Result }

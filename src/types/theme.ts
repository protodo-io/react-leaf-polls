export interface Theme {
  mainColor?: string // multiple poll only
  otherColor?: string // multiple poll only
  answerTextColor?: string // multiple poll only
  answerPercentageColor?: string // multiple poll only

  leftColor?: string // binary poll only
  rightColor?: string // binary poll only
  answerTextRightColor?: string // binary poll only
  answerTextLeftColor?: string // binary poll only

  textColor?: string
  backgroundColor?: string
  alignment?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'

  consensusSimpleLeft?: string
  consensusSimpleMiddle?: string
  consensusSimpleRight?: string
}

import { RefObject } from 'react'
import { Result } from '../../types/result'
import styles from './ConsensusSimplePoll.module.css'
import { Theme } from '../../types/theme'

function manageVote(
  results: Result[],
  item: Result,
  refs: RefObject<HTMLDivElement>[]
): void {
  item.votes++
  countPercentage(results)
  animateAnswers(results, refs)
}

function animateWidth(
  answer: HTMLElement | null,
  percentage: number | undefined
) {
  if (answer && percentage) {
    // animate background width
    answer.animate(
      [
        { width: `${100 / 3}%`, easing: 'ease-out' },
        { width: `${percentage}%`, easing: 'ease-out' }
      ],
      500
    )
    Object.assign(answer.style, { width: `${percentage}%` })
  }
}

function animateColor(answer: HTMLElement | null, color: string | undefined) {
  console.log('*** KIGA-LOG => answer', answer)
  console.log('*** KIGA-LOG => color', color)
  if (answer && color) {
    answer.animate(
      [{ backgroundColor: 'white' }, { backgroundColor: color || '#9F9F9F' }],
      200
    )
    Object.assign(answer.style, {
      backgroundColor: color || '#9F9F9F'
    })
  }
}

function disableHover(
  answer: HTMLElement | null,
  styles: { [x: string]: string; answer_hover?: any }
) {
  if (answer) {
    // disable hovering after the animation
    answer.classList.remove(styles.answer_hover)
  }
}

function animateAnswers(
  results: Result[],
  refs: RefObject<HTMLDivElement>[],
  theme?: Theme
): void {
  if (results.length !== 3) {
    throw new Error('Expected exactly three results')
  }

  const answerColors = [
    theme?.consensusSimpleLeft,
    theme?.consensusSimpleMiddle,
    theme?.consensusSimpleRight
  ]

  for (let i = 0; i < 3; i++) {
    const answer: HTMLElement | null = refs[i].current
    let percentage: number | undefined = results[i].percentage

    if (i === 2) {
      // If it's the abstain option
      percentage = 10
    }

    if (answer && percentage) {
      if (i !== 2) animateWidth(answer, percentage)
      animateColor(answer, answerColors[i])
      disableHover(answer, styles)
    }
  }
}

function countPercentage(results: Result[]): void {
  const sum: number = results.reduce((acc, result, i) => {
    if (i !== 2) {
      // If not the abstain option
      acc += result.votes
    }
    return acc
  }, 0)

  results.forEach((result, i) => {
    if (i !== 2) {
      if (sum === 0) {
        result.percentage = 0
      } else {
        result.percentage = Math.round((result.votes / sum) * 100)
      }
    } else {
      result.percentage = result.votes // For abstain option in consensus poll
    }
  })
}

export { manageVote, countPercentage, animateAnswers }

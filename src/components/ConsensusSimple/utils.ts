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

function animateColor(answer: HTMLElement | null, theme: Theme | undefined) {
  if (answer && theme) {
    // animate background color
    answer.animate(
      [
        { backgroundColor: 'white' },
        { backgroundColor: theme?.otherColor || '#9F9F9F' }
      ],
      200
    )
    Object.assign(answer.style, {
      backgroundColor: theme?.otherColor || '#9F9F9F'
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

  for (let i = 0; i < 3; i++) {
    const answer: HTMLElement | null = refs[i].current
    const percentage: number | undefined = results[i].percentage

    if (answer && percentage) {
      animateWidth(answer, percentage)
      animateColor(answer, theme)

      // set padding to 0
      // Object.assign(answer.style, { padding: '0' })

      disableHover(answer, styles)
    }
  }
}

function countPercentage(results: Result[]): void {
  const sum: number = results.reduce((acc, result) => acc + result.votes, 0)

  results.forEach((result) => {
    result.percentage = Math.round((result.votes / sum) * 100)
  })
}

export { manageVote, countPercentage, animateAnswers }

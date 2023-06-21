import { RefObject } from 'react'
import { Result } from '../../types/result'
import styles from './BinaryPoll.module.css'
import { Theme } from '../../types/theme'

function manageVote(
  results: Result[],
  item: Result,
  index: number,
  refs: RefObject<HTMLDivElement>[]
): void {
  item.votes++
  countPercentage(results)
  animateAnswers(index, results, refs)
}

function animateWidth(
  answer: HTMLElement | null,
  anotherAnswer: HTMLElement | null,
  percentage: number | undefined
) {
  if (answer && anotherAnswer && percentage) {
    // animate background width
    answer.animate(
      [
        { width: '50%', easing: 'ease-out' },
        { width: `${percentage}%`, easing: 'ease-out' }
      ],
      500
    )
    anotherAnswer.animate(
      [
        { width: '50%', easing: 'ease-out' },
        { width: `${100 - percentage}%`, easing: 'ease-out' }
      ],
      500
    )
    Object.assign(answer.style, { width: `${percentage}%` })
    Object.assign(anotherAnswer.style, { width: `${100 - percentage}%` })
  }
}

function animateColor(
  answer: HTMLElement | null,
  anotherAnswer: HTMLElement | null,
  answerColor: string | undefined,
  anotherAnswerColor: string | undefined
) {
  console.log('*** KIGA-LOG => answer', answer)
  console.log('*** KIGA-LOG => color', answerColor)
  if (answer && anotherAnswer && answerColor && answerColor) {
    answer.animate(
      [
        { backgroundColor: 'white' },
        { backgroundColor: answerColor || '#9F9F9F' }
      ],
      200
    )
    anotherAnswer.animate(
      [
        { backgroundColor: 'white' },
        { backgroundColor: anotherAnswerColor || '#9F9F9F' }
      ],
      200
    )
    Object.assign(answer.style, {
      backgroundColor: answerColor || '#9F9F9F'
    })

    Object.assign(anotherAnswer.style, {
      backgroundColor: anotherAnswerColor || '#9F9F9F'
    })
  }
}

function disableHover(
  answer: HTMLElement | null,
  anotherAnswer: HTMLElement | null,
  styles: { [x: string]: string; answer_hover?: any }
) {
  if (answer && anotherAnswer) {
    // disable hovering after the animation
    answer.classList.remove(styles.answer_hover)
    anotherAnswer.classList.remove(styles.answer_hover)
  }
}

function animateAnswers(
  index: number,
  results: Result[],
  refs: RefObject<HTMLDivElement>[],
  theme?: Theme
): void {
  const answer: HTMLElement | null = refs[index].current
  // get not clicked answer element
  const oppositeIndex: number = index === 0 ? 1 : 0
  const anotherAnswer: HTMLElement | null = refs[oppositeIndex].current
  const percentage: number | undefined = results[index].percentage

  if (results.length !== 2) {
    throw new Error('Expected exactly two results')
  }

  const answerColors = [theme?.leftColor, theme?.rightColor]

  if (answer && anotherAnswer && percentage) {
    animateWidth(answer, anotherAnswer, percentage)
    animateColor(answer, anotherAnswer, answerColors[0], answerColors[1])

    // set padding to 0
    Object.assign(answer.style, { padding: '0' })
    Object.assign(anotherAnswer.style, { padding: '0' })

    disableHover(answer, anotherAnswer, styles)
  }
}

function countPercentage(results: Result[]): void {
  const sum: number = results[0].votes + results[1].votes

  results[0].percentage = Math.round((results[0].votes / sum) * 100)
  results[1].percentage = Math.round((results[1].votes / sum) * 100)
}

export { manageVote, countPercentage, animateAnswers }

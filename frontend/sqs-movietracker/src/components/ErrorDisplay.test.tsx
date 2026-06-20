import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorDisplay } from './ErrorDisplay'

describe('ErrorDisplay', () => {
  it('renders the default error message', () => {
    render(<ErrorDisplay />)

    expect(screen.getByRole('heading', { name: 'Oops!' })).toBeTruthy()
    expect(screen.getByText('Something went wrong.')).toBeTruthy()
  })

  it('renders a custom error message', () => {
    render(<ErrorDisplay message="Movie details could not be loaded." />)

    expect(screen.getByText('Movie details could not be loaded.')).toBeTruthy()
  })
})

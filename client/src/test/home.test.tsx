/**
 * @jest-environment jsdom
 */
import HomePage from '../pages/home/index';
import { render } from '@testing-library/react';
import React from 'react';

test('HomePage snapshot', () => {
	render(<HomePage />);
});

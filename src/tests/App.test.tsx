import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
    it('renders without crashing', () => {
        // Since App uses Suspense, we might need to wait, but a simple render check is a good start.
        // Note: Rendering the full App might fail if nested routes require context not provided here, 
        // but App.tsx providers are at the top level.
        render(<App />);
        expect(document.body).toBeDefined();
    });
});

import { createFileRoute } from '@tanstack/react-router';
import { SignInPage } from '../utils/SignInPage';

export const Route = createFileRoute('/signin')({
  component: SignInPage,
});

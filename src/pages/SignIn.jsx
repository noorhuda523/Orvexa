import AuthForm from '../components/AuthForm';
import { useApp } from '../context/AppContext';

export default function SignIn() {
  const { go, signIn } = useApp();
  return <AuthForm mode="signin" go={go} signIn={signIn} />;
}

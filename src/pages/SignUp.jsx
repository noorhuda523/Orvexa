import AuthForm from '../components/AuthForm';
import { useApp } from '../context/AppContext';

export default function SignUp() {
  const { go, signIn } = useApp();
  return <AuthForm mode="signup" go={go} signIn={signIn} />;
}

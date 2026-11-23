import { Btn } from '../components/Button';
import { EmptyState } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const { go } = useApp();
  return (
    <div className="pg wrap ph">
      <EmptyState title="Page not found" text="That address doesn’t match any page." action={<Btn onClick={() => go('home')}>Back to home</Btn>} />
    </div>
  );
}

export default function SkipLink() {
  const skip = () => {
    const m = document.querySelector('main');
    if (m) { m.focus(); m.scrollIntoView({ behavior: 'auto' }); }
  };
  return <button className="skip" onClick={skip}>Skip to content</button>;
}

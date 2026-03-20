import './ProgressBar.css';

export default function ProgressBar({ current, total }) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`progress-segment ${
            i < current ? 'filled' : i === current ? 'active' : ''
          }`}
        />
      ))}
    </div>
  );
}

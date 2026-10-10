export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state error" role="alert">
      <p>{message}</p>
      {onRetry ? <button className="btn" onClick={onRetry}>Try again</button> : null}
    </div>
  );
}

import { Lock } from "lucide-react";
import { Button } from "../shared/Button";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface UnlockButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function UnlockButton({
  onClick,
  disabled = false,
  loading = false,
}: UnlockButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      className="mt-4 w-full"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Unlock ATM
        </>
      )}
    </Button>
  );
}

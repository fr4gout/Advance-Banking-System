import { Banknote } from "lucide-react";
import { Button } from "../shared/Button";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface WithdrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function WithdrawButton({
  onClick,
  disabled = false,
  loading = false,
}: WithdrawButtonProps) {
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
          <Banknote className="mr-2 h-5 w-5" />
          Withdraw Cash
        </>
      )}
    </Button>
  );
}

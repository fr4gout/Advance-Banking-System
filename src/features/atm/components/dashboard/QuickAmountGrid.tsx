import { Button } from "../shared/Button";
import { formatCurrency } from "../../utils/currency";

interface QuickAmountGridProps {
  onSelect: (amount: number) => void;
  onMax: () => void;
  onClear: () => void;
}

const quickAmounts = [50, 100, 250, 500, 1000, 2500];

export function QuickAmountGrid({ onSelect, onMax, onClear }: QuickAmountGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {quickAmounts.map((amount) => (
        <Button
          key={amount}
          variant="secondary"
          size="sm"
          onClick={() => onSelect(amount)}
          className="font-mono text-xs"
        >
          {formatCurrency(amount)}
        </Button>
      ))}
      <Button variant="secondary" size="sm" onClick={onMax}>
        MAX
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>
        CLR
      </Button>
    </div>
  );
}

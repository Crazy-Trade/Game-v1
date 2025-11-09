export function formatCurrency(value: number, compact: boolean = false): string {
    if (compact) {
        if (Math.abs(value) >= 1e12) {
            return `$${(value / 1e12).toFixed(2)}T`;
        }
        if (Math.abs(value) >= 1e9) {
            return `$${(value / 1e9).toFixed(2)}B`;
        }
        if (Math.abs(value) >= 1e6) {
            return `$${(value / 1e6).toFixed(2)}M`;
        }
         if (Math.abs(value) >= 1e3) {
            return `$${(value / 1e3).toFixed(1)}K`;
        }
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
}

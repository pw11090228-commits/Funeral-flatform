export function calculateInstallmentTotal(monthlyAmount: number, paymentMonths: number): number {
  if (!Number.isSafeInteger(monthlyAmount) || monthlyAmount < 0) {
    throw new RangeError("월 납입금은 0 이상의 안전한 정수여야 합니다.");
  }

  if (!Number.isSafeInteger(paymentMonths) || paymentMonths < 0) {
    throw new RangeError("납입 개월 수는 0 이상의 안전한 정수여야 합니다.");
  }

  const total = monthlyAmount * paymentMonths;
  if (!Number.isSafeInteger(total)) {
    throw new RangeError("계산 결과가 안전한 정수 범위를 벗어났습니다.");
  }

  return total;
}

export function formatKoreanWon(amount: number): string {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError("금액은 안전한 정수여야 합니다.");
  }

  return `${new Intl.NumberFormat("ko-KR").format(amount)}원`;
}

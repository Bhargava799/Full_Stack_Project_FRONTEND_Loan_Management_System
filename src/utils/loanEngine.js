// Loan Engine — EMI, amortization, and risk utilities

/**
 * Calculate EMI using standard formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (annualRate === 0) return principal / tenureMonths;
  const r = annualRate / 100 / 12;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Generate full amortization schedule
 */
export function generateAmortizationSchedule(principal, annualRate, tenureMonths, startDate = new Date()) {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const r = annualRate / 100 / 12;
  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= tenureMonths; i++) {
    const interestPayment = Math.round(balance * r * 100) / 100;
    const principalPayment = Math.round((emi - interestPayment) * 100) / 100;
    balance = Math.round((balance - principalPayment) * 100) / 100;
    if (balance < 0) balance = 0;

    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      month: i,
      dueDate: dueDate.toISOString().split('T')[0],
      emi: emi,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance,
      status: i <= 6 ? 'paid' : i === 7 ? 'upcoming' : 'pending',
    });
  }
  return schedule;
}

/**
 * Calculate total interest over the life of the loan
 */
export function calculateTotalInterest(principal, annualRate, tenureMonths) {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  return Math.round((emi * tenureMonths - principal) * 100) / 100;
}

/**
 * Calculate outstanding balance at a given month
 */
export function calculateOutstandingBalance(principal, annualRate, tenureMonths, monthsPaid) {
  const r = annualRate / 100 / 12;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  if (r === 0) return principal - emi * monthsPaid;
  const balance = principal * Math.pow(1 + r, monthsPaid) - emi * ((Math.pow(1 + r, monthsPaid) - 1) / r);
  return Math.max(0, Math.round(balance * 100) / 100);
}

/**
 * Simple risk score (0–100) based on credit attributes
 */
export function assessRiskScore(borrower) {
  let score = 50;
  if (borrower.creditScore >= 750) score += 25;
  else if (borrower.creditScore >= 650) score += 15;
  else if (borrower.creditScore >= 550) score += 5;
  else score -= 15;

  if (borrower.dti < 0.3) score += 10;
  else if (borrower.dti < 0.45) score += 5;
  else score -= 10;

  if (borrower.yearsEmployed >= 5) score += 10;
  else if (borrower.yearsEmployed >= 2) score += 5;

  if (borrower.missedPayments === 0) score += 5;
  else score -= borrower.missedPayments * 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Risk category from score
 */
export function getRiskCategory(score) {
  if (score >= 80) return { label: 'Low Risk', color: '#06d6a0' };
  if (score >= 60) return { label: 'Medium Risk', color: '#ffd166' };
  if (score >= 40) return { label: 'High Risk', color: '#ef476f' };
  return { label: 'Very High Risk', color: '#d62828' };
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency with decimals
 */
export function formatCurrencyExact(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

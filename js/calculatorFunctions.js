export function calcTax(income) {

  let tax = 0;

  if (income <= 18200) {
    tax = 0;
  }
  else if (income <= 45000) {
    tax = ((income - 18200) * 0.16);
  }
  else if (income <= 135000) {
    tax = 4288 + ((income - 45000) * 0.30);
  }
  else if (income <= 190000) {
    tax = 31288 + ((income - 135000) * 0.37);
  }
  else {
    tax = 51638 + ((income - 190000) * 0.45);
  }

  return tax;
}

export function calcAnnualMls(mlsIncome, mlsStatus, dependents, mlsExempt, income) {
  let mlsAnnual = 0;
  let mlsDependents = 0;

// mls family thresholds
  if (mlsStatus == "family") {

    if (dependents > 0) {
      mlsDependents -= 1;
    }
    else {
      mlsDependents = 0;
    }

    let baseTier = 202000 + (1500 * mlsDependents);
    let tier1 = 236000 + (1500 * mlsDependents);
    let tier2 = 316000 + (1500 * mlsDependents);

    if (mlsIncome <= baseTier) {
      mlsAnnual = income * 0.00;
    } else if (mlsIncome <= tier1) {
      mlsAnnual = income * 0.01;
    } else if (mlsIncome <= tier2) {
      mlsAnnual = income * 0.0125;
    } else {
      mlsAnnual = income * 0.015;
    }
  }

// mls single thresholds

  if (mlsStatus == "single") {

    if (mlsIncome <= 101000) {
      mlsAnnual = income * 0.00;
    } else if (mlsIncome <= 118000) {
      mlsAnnual = income * 0.01;
    } else if (mlsIncome <= 158000) {
      mlsAnnual = income * 0.0125;
    } else {
      mlsAnnual = income * 0.015;
    }
  }

  let mls = (mlsAnnual / 365) * (365 - mlsExempt);

  return mls;
}


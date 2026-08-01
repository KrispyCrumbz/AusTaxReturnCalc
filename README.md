![Status](https://img.shields.io/badge/status-active-green)
![Type](https://img.shields.io/badge/type-web_application-blue)

# Taxpert – Australian Tax Return Estimator

Taxpert is a personal software project developed to explore financial software development and Australian income tax calculations. It serves as the initial prototype for **Deductly**, a larger personal finance application currently under development that aims to simplify expense tracking, tax preparation, and financial organisation for Australian taxpayers.

The live application can be accessed here:

👉 https://krispycrumbz.github.io/Taxpert/

---

## Features

* Australian tax return estimation
* Simple and responsive user interface
* Real-time calculation updates
* Income and deduction input fields
* Estimated refund or tax payable calculation
* Client-side processing (no data storage)

---

## How It Works

Taxpert performs tax estimations entirely within the browser using JavaScript.

1. User enters taxable income and relevant financial information.
2. The application validates the provided inputs.
3. Tax calculations are performed using Australian income tax brackets and predefined calculation logic.
4. Estimated tax payable or refund information is displayed instantly.
5. All calculations are completed locally within the user's browser without transmitting personal data.

---

## Future Development

Taxpert is intended to evolve into **Deductly**, a more comprehensive personal finance platform. Planned features include:

* Expense tracking and categorisation
* Receipt management
* Tax deduction tracking
* Financial dashboards and analytics
* Budget planning
* Secure user authentication
* Cloud data synchronisation
* Exportable tax summaries
* Mobile-friendly experience
* AI-assisted financial insights

---

## Tech Stack

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## Project Structure

```
Taxpert/
│
├── index.html
├── style.css
├── script.js
├── assets/
└── README.md
```

---

## Running Locally

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.

Alternatively, visit the live version:

👉 https://krispycrumbz.github.io/Taxpert/

---

## Download (ZIP)

If you cannot clone the repository, you can download the project as a ZIP file:

[![Download ZIP](https://img.shields.io/badge/Download-ZIP-blue)](https://github.com/KrispyCrumbz/Taxpert/archive/refs/heads/main.zip)

---

## Current Limitations

* Provides estimates only and should not be used as official tax advice.
* Supports a limited range of tax scenarios.
* Does not currently store user information or financial history.
* Does not yet support expense tracking or deduction management.
* Tax rules will require updates as Australian taxation policies change.

---

## Roadmap

Planned milestones include:

* Improve tax calculation accuracy and expand supported tax scenarios.
* Add persistent expense tracking.
* Develop an integrated deductions manager.
* Introduce account creation and secure login.
* Build interactive financial dashboards.
* Generate downloadable tax summaries and reports.
* Transform Taxpert into the full **Deductly** platform.

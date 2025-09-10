
CREATE DATABASE financial_app;

\c financial_app;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'USER'
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

INSERT INTO users (email, username, password, phone_number, role) 
VALUES ('test@example.com', 'testuser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890', 'USER')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Domain tables used by the mobile app features
-- ============================================================

-- Accounts (for balances and transfers)
CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL, -- e.g., CHECKING, SAVINGS, CREDIT
    currency VARCHAR(10) NOT NULL DEFAULT 'EGP',
    balance NUMERIC(14,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- Transactions (for the Transactions screen and balance history)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    txn_type VARCHAR(10) NOT NULL, -- DEBIT or CREDIT
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    description VARCHAR(255),
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_occurred_at ON transactions(occurred_at);

-- Bills (for the Bills screen)
CREATE TABLE IF NOT EXISTS bills (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE
    recurrence VARCHAR(20) -- MONTHLY, QUARTERLY, YEARLY, NONE
);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);

-- Budgets (for the Budget Tracker screen)
CREATE TABLE IF NOT EXISTS budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    monthly_limit NUMERIC(14,2) NOT NULL,
    month INT NOT NULL,  -- 1-12
    year INT NOT NULL,
    spent NUMERIC(14,2) NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_budgets_user_cat_month_year
  ON budgets(user_id, category, month, year);

-- Savings Goals (for the Savings Goals screen)
CREATE TABLE IF NOT EXISTS savings_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    target_amount NUMERIC(14,2) NOT NULL,
    current_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' -- ACTIVE, COMPLETED, PAUSED
);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);

-- Notifications (for the Notifications screen)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    body VARCHAR(500) NOT NULL,
    notif_type VARCHAR(30) NOT NULL, -- BILL, BUDGET, SYSTEM, TRANSACTION
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Transfers (for the Transfer screen)
CREATE TABLE IF NOT EXISTS transfers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
    to_account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
    amount NUMERIC(14,2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_transfers_user_id ON transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON transfers(created_at);

-- User Settings (for the Settings screen)
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL DEFAULT 'EGP',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    theme VARCHAR(20) NOT NULL DEFAULT 'LIGHT' -- LIGHT or DARK
);

-- ============================================================
-- Mock data linked by user_id
-- ============================================================

-- Create two accounts for the test user
INSERT INTO accounts (user_id, name, type, currency, balance)
SELECT id, 'Checking', 'CHECKING', 'EGP', 74747.88 FROM users WHERE email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO accounts (user_id, name, type, currency, balance)
SELECT id, 'Savings', 'SAVINGS', 'EGP', 312625.00 FROM users WHERE email = 'test@example.com'
ON CONFLICT DO NOTHING;

-- Transactions for Checking account
INSERT INTO transactions (user_id, account_id, txn_type, category, amount, description, occurred_at)
SELECT u.id, a.id, 'DEBIT', 'Groceries', 2604.70, 'Whole Foods', NOW() - INTERVAL '3 days'
FROM users u JOIN accounts a ON a.user_id = u.id AND a.name = 'Checking'
WHERE u.email = 'test@example.com';

INSERT INTO transactions (user_id, account_id, txn_type, category, amount, description, occurred_at)
SELECT u.id, a.id, 'DEBIT', 'Transport', 556.63, 'Uber ride', NOW() - INTERVAL '2 days'
FROM users u JOIN accounts a ON a.user_id = u.id AND a.name = 'Checking'
WHERE u.email = 'test@example.com';

INSERT INTO transactions (user_id, account_id, txn_type, category, amount, description, occurred_at)
SELECT u.id, a.id, 'CREDIT', 'Income', 91500.00, 'Monthly salary', NOW() - INTERVAL '10 days'
FROM users u JOIN accounts a ON a.user_id = u.id AND a.name = 'Checking'
WHERE u.email = 'test@example.com';

-- Bills
INSERT INTO bills (user_id, name, amount, due_date, status, recurrence)
SELECT id, 'Electricity', 1830.00, (CURRENT_DATE + INTERVAL '7 days')::date, 'PENDING', 'MONTHLY' FROM users WHERE email = 'test@example.com';

INSERT INTO bills (user_id, name, amount, due_date, status, recurrence)
SELECT id, 'Internet', 1372.50, (CURRENT_DATE + INTERVAL '3 days')::date, 'PENDING', 'MONTHLY' FROM users WHERE email = 'test@example.com';

-- Budgets for current month
INSERT INTO budgets (user_id, category, monthly_limit, month, year, spent)
SELECT id, 'Groceries', 12200.00, EXTRACT(MONTH FROM CURRENT_DATE)::int, EXTRACT(YEAR FROM CURRENT_DATE)::int, 3660.00
FROM users WHERE email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO budgets (user_id, category, monthly_limit, month, year, spent)
SELECT id, 'Transport', 4575.00, EXTRACT(MONTH FROM CURRENT_DATE)::int, EXTRACT(YEAR FROM CURRENT_DATE)::int, 1067.50
FROM users WHERE email = 'test@example.com'
ON CONFLICT DO NOTHING;

-- Savings goals
INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, status)
SELECT id, 'Emergency Fund', 152500.00, 38125.00, (CURRENT_DATE + INTERVAL '6 months')::date, 'ACTIVE'
FROM users WHERE email = 'test@example.com';

INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, status)
SELECT id, 'Vacation', 61000.00, 12200.00, (CURRENT_DATE + INTERVAL '4 months')::date, 'ACTIVE'
FROM users WHERE email = 'test@example.com';

-- Notifications
INSERT INTO notifications (user_id, title, body, notif_type, is_read)
SELECT id, 'Bill due soon', 'Your Internet bill is due in 3 days', 'BILL', FALSE
FROM users WHERE email = 'test@example.com';

INSERT INTO notifications (user_id, title, body, notif_type, is_read)
SELECT id, 'Budget alert', 'You have spent 30% of your Groceries budget', 'BUDGET', FALSE
FROM users WHERE email = 'test@example.com';

-- Transfer from Checking to Savings
INSERT INTO transfers (user_id, from_account_id, to_account_id, amount, description)
SELECT u.id,
       (SELECT id FROM accounts WHERE user_id = u.id AND name = 'Checking'),
       (SELECT id FROM accounts WHERE user_id = u.id AND name = 'Savings'),
       7625.00,
       'Monthly savings transfer'
FROM users u WHERE u.email = 'test@example.com';

-- User settings
INSERT INTO user_settings (user_id, currency, notifications_enabled, theme)
SELECT id, 'EGP', TRUE, 'LIGHT' FROM users WHERE email = 'test@example.com'
ON CONFLICT (user_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS `adv_bank_accounts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `account_id` VARCHAR(64) NOT NULL UNIQUE,
    `citizenid` VARCHAR(64) NOT NULL,
    `kind` VARCHAR(32) NOT NULL DEFAULT 'personal',
    `name` VARCHAR(128) NOT NULL DEFAULT 'Personal Account',
    `iban` VARCHAR(64) NOT NULL UNIQUE,
    `balance` BIGINT NOT NULL DEFAULT 0,
    `short_label` VARCHAR(32) DEFAULT 'PERSONAL',
    `withdraw_limit` BIGINT DEFAULT NULL,
    `deposit_limit` BIGINT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_citizenid` (`citizenid`)
);

CREATE TABLE IF NOT EXISTS `adv_bank_transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `account_id` VARCHAR(64) NOT NULL,
    `citizenid` VARCHAR(64) NOT NULL,
    `tx_type` VARCHAR(32) NOT NULL,
    `amount` BIGINT NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `counterparty` VARCHAR(255) DEFAULT NULL,
    `note` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_account` (`account_id`),
    INDEX `idx_citizenid` (`citizenid`)
);

CREATE TABLE IF NOT EXISTS `adv_bank_cards` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `card_id` VARCHAR(64) NOT NULL UNIQUE,
    `citizenid` VARCHAR(64) NOT NULL,
    `account_id` VARCHAR(64) NOT NULL,
    `holder_name` VARCHAR(128) NOT NULL,
    `masked_pan` VARCHAR(32) NOT NULL,
    `last4` VARCHAR(4) NOT NULL,
    `pin_hash` VARCHAR(128) DEFAULT NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_card_citizen` (`citizenid`)
);

CREATE TABLE IF NOT EXISTS `adv_bank_contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `contact_id` VARCHAR(64) NOT NULL,
    `citizenid` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `iban` VARCHAR(64) NOT NULL,
    `favorite` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uniq_contact` (`citizenid`, `contact_id`)
);

CREATE TABLE IF NOT EXISTS `adv_bank_invoices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `invoice_id` VARCHAR(64) NOT NULL UNIQUE,
    `sender_citizenid` VARCHAR(64) NOT NULL,
    `recipient_citizenid` VARCHAR(64) NOT NULL,
    `sender` VARCHAR(128) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `amount` BIGINT NOT NULL,
    `due_date` BIGINT NOT NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'unpaid',
    `category` VARCHAR(32) DEFAULT 'player',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

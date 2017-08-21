'use strict';

module.exports = {
  env: 'development',
  database : process.env.MONGODB || 'library-dev',
  emailer : {
    // safeRecipient: process.env.MAILER_SAFE_RECIPIENT || "your-safe-email-recipient@here.com"
  }
};
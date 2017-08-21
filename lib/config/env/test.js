'use strict';

module.exports = {
  env: 'test',
  database: process.env.MONGODB || 'library-test',

  emailer : {
    // safeRecipient: process.env.MAILER_SAFE_RECIPIENT || "your-safe-email-recipient@here.com"
  }
};
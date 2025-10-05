#!/usr/bin/env node
/**
 * Environment Variables Checker
 *
 * Verifies that all required environment variables are set.
 * Run with: node scripts/check-env.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', // ← This is what we're checking
];

const optionalEnvVars = [
  'NEXT_PUBLIC_ADMIN_UID',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'ADMIN_EMAIL',
];

console.log('🔍 Checking Environment Variables...\n');

let allRequiredSet = true;

console.log('📋 Required Variables (Firebase Analytics):');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value;
  const status = isSet ? '✅' : '❌';
  const display = isSet ? `${value.substring(0, 20)}${value.length > 20 ? '...' : ''}` : 'NOT SET';

  console.log(`${status} ${varName}: ${display}`);

  if (!isSet) {
    allRequiredSet = false;
  }
});

console.log('\n📋 Optional Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value;
  const status = isSet ? '✅' : '⚠️';
  const display = isSet ? `${value.substring(0, 20)}${value.length > 20 ? '...' : ''}` : 'NOT SET';

  console.log(`${status} ${varName}: ${display}`);
});

console.log('\n' + '='.repeat(60));

if (allRequiredSet) {
  console.log('✅ All required environment variables are set!');
  console.log('\n📊 Firebase Analytics is configured with:');
  console.log(`   Measurement ID: ${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`);
  console.log('\n🚀 Your analytics will work in production!');
  process.exit(0);
} else {
  console.log('❌ Some required environment variables are missing!');
  console.log('\n📝 To fix:');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Fill in the missing values from Firebase Console');
  console.log('   3. Re-run this script to verify');
  process.exit(1);
}

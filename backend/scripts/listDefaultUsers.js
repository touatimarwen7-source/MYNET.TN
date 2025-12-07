
require('dotenv').config();

const defaultUsers = [
  {
    email: 'admin@mynet.tn',
    role: 'admin',
    password: 'Admin@2025',
    description: 'حساب المسؤول الرئيسي'
  },
  {
    email: 'buyer1@test.tn',
    role: 'buyer',
    password: 'Buyer123!',
    description: 'حساب مشتري تجريبي 1'
  },
  {
    email: 'buyer2@test.tn',
    role: 'buyer',
    password: 'Buyer123!',
    description: 'حساب مشتري تجريبي 2'
  },
  {
    email: 'supplier1@test.tn',
    role: 'supplier',
    password: 'Supplier123!',
    description: 'حساب مزود تجريبي 1'
  },
  {
    email: 'supplier2@test.tn',
    role: 'supplier',
    password: 'Supplier123!',
    description: 'حساب مزود تجريبي 2'
  }
];

console.log('\n==============================================');
console.log('📋 الحسابات الافتراضية المسجلة في المنصة');
console.log('==============================================\n');

defaultUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.description}`);
  console.log(`   البريد الإلكتروني: ${user.email}`);
  console.log(`   كلمة المرور: ${user.password}`);
  console.log(`   الدور: ${user.role}`);
  console.log('   ------------------------------');
});

console.log('\n💡 ملاحظة: يرجى تغيير كلمات المرور بعد أول تسجيل دخول');
console.log('==============================================\n');

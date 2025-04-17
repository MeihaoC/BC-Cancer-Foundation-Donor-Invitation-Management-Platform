const db = require('../db');
const hashPassword = require('../db').hashPassword;

const hashAllUsers = async () => {
  try {
    const [users] = await db.execute('SELECT id, email FROM User');

    for (const user of users) {
      const hashed = await hashPassword('password123');
      await db.execute('UPDATE User SET password = ? WHERE id = ?', [hashed, user.id]);
      console.log(`Updated password for ${user.email}`);
    }

    console.log('🎉 All users updated with hashed passwords!');
    process.exit();
  } catch (err) {
    console.error('Error updating users:', err);
    process.exit(1);
  }
};

hashAllUsers();
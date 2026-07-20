import prisma from './config/db';

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING CAREERTRACK LITE RBAC INTEGRATION TESTS ===');

  try {
    // 0. Clean database for a fresh test run
    await prisma.application.deleteMany();
    await prisma.user.deleteMany();
    console.log('✔ Database tables flushed successfully.');

    // 1. Register User A (Standard User)
    const userARes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Standard User A',
        email: 'user_a@test.com',
        password: 'passwordA123',
      }),
    });

    const userAData = (await userARes.json()) as any;
    if (userARes.status !== 201) {
      throw new Error(`Failed to register User A: ${JSON.stringify(userAData)}`);
    }
    const tokenA = userAData.token;
    console.log(`✔ User A registered successfully. Role: ${userAData.user.role} (Expected: USER)`);

    // 2. Register User B (Admin Kabir)
    const adminRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kabir Admin',
        email: 'kabir@bd.com',
        password: 'adminPassword123',
      }),
    });

    const adminData = (await adminRes.json()) as any;
    if (adminRes.status !== 201) {
      throw new Error(`Failed to register Admin Kabir: ${JSON.stringify(adminData)}`);
    }
    const tokenAdmin = adminData.token;
    console.log(`✔ Admin Kabir registered successfully. Role: ${adminData.user.role} (Expected: ADMIN)`);

    // 3. Create job application for User A
    const appRes = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Tech Corp',
        jobTitle: 'Software Engineer',
        source: 'LinkedIn',
        status: 'Applied',
        applicationDate: new Date().toISOString(),
        notes: 'First application notes',
      }),
    });

    const appData = (await appRes.json()) as any;
    if (appRes.status !== 201) {
      throw new Error(`Failed to create application: ${JSON.stringify(appData)}`);
    }
    const appId = appData.application.id;
    console.log(`✔ Application created for User A. ID: ${appId}`);

    // 4. Security Check: Standard User A attempts to access admin stats endpoint
    console.log('\n4. Security Check: User A (Standard) requests admin stats...');
    const adminStatsA = await fetch(`${API_URL}/dashboard/admin/stats`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log(`Status returned: ${adminStatsA.status}`);
    if (adminStatsA.status === 403) {
      console.log('✔ User A request blocked with 403 Forbidden. Separation verified.');
    } else {
      throw new Error(`Security breach! Standard user was allowed to request admin stats with code ${adminStatsA.status}`);
    }

    // 5. Admin Kabir requests admin stats
    console.log('\n5. Admin Kabir requests admin stats...');
    const adminStatsRes = await fetch(`${API_URL}/dashboard/admin/stats`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    console.log(`Status returned: ${adminStatsRes.status}`);
    if (adminStatsRes.status !== 200) {
      throw new Error(`Failed to fetch admin stats: ${await adminStatsRes.text()}`);
    }
    const adminStatsData = (await adminStatsRes.json()) as any;
    console.log('✔ Admin stats retrieved successfully.');
    console.log(`- Total Users: ${adminStatsData.totalUsers} (Expected: 2)`);
    console.log(`- Total Applications: ${adminStatsData.totalApplications} (Expected: 1)`);
    console.log(`- Status Stats: ${JSON.stringify(adminStatsData.statusStats)}`);
    console.log(`- Users List length: ${adminStatsData.usersList.length}`);

    // Verify stats content
    if (adminStatsData.totalUsers !== 2 || adminStatsData.totalApplications !== 1) {
      throw new Error('Stats counters mismatch.');
    }
    console.log('✔ Admin counts validation passed.');

    // 6. User A updates status
    const updateRes = await fetch(`${API_URL}/applications/${appId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ status: 'Interview' }),
    });
    if (updateRes.status !== 200) {
      throw new Error('User A failed to update application status.');
    }
    console.log('\n✔ User A successfully updated application status.');

    // 7. Clean up database
    await prisma.application.deleteMany();
    await prisma.user.deleteMany();
    console.log('✔ Test cleanup complete.');

    console.log('\n===================================================');
    console.log('✔✔✔ ALL RBAC INTEGRATION TESTS PASSED SUCCESSFULLY ✔✔✔');
    console.log('===================================================');
  } catch (error) {
    console.error('\n❌ TEST RUN FAILED WITH ERROR:', error);
    process.exit(1);
  }
}

runTests();

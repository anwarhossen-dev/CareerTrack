const BACKEND_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING CAREERTRACK LITE INTEGRATION TESTS ===\n');

  try {
    const timestamp = Date.now();
    const emailA = `usera_${timestamp}@test.com`;
    const emailB = `userb_${timestamp}@test.com`;
    const password = 'password123';

    // 1. Register User A
    console.log('1. Registering User A...');
    const registerARes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User A', email: emailA, password })
    });
    if (!registerARes.ok) throw new Error(`Failed to register User A: ${await registerARes.text()}`);
    const registerAData: any = await registerARes.json();
    const tokenA = registerAData.token;
    console.log('✔ User A registered successfully.');

    // 2. Register User B
    console.log('\n2. Registering User B...');
    const registerBRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User B', email: emailB, password })
    });
    if (!registerBRes.ok) throw new Error(`Failed to register User B: ${await registerBRes.text()}`);
    const registerBData: any = await registerBRes.json();
    const tokenB = registerBData.token;
    console.log('✔ User B registered successfully.');

    // 3. Create a Job Application for User A
    console.log('\n3. Creating job application for User A...');
    const createJobRes = await fetch(`${BACKEND_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        companyName: 'Google',
        jobTitle: 'Software Engineer',
        jobUrl: 'https://careers.google.com',
        source: 'LinkedIn',
        status: 'Applied',
        applicationDate: '2026-07-20',
        notes: 'First round interview scheduled'
      })
    });
    if (!createJobRes.ok) throw new Error(`Failed to create application: ${await createJobRes.text()}`);
    const createJobData: any = await createJobRes.json();
    const appAId = createJobData.application.id;
    console.log(`✔ Application created with ID: ${appAId}`);

    // 4. Verify User A can list their application
    console.log("\n4. Fetching User A's application list...");
    const listARes = await fetch(`${BACKEND_URL}/applications`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const listAData: any = await listARes.json();
    if (listAData.applications.length !== 1 || listAData.applications[0].id !== appAId) {
      throw new Error(`List verification failed for User A. Expected 1 app, got ${listAData.applications.length}`);
    }
    console.log('✔ User A list contains 1 application matching created ID.');

    // 5. Verify User B does NOT see User A's application
    console.log("\n5. Fetching User B's application list (should be empty)...");
    const listBRes = await fetch(`${BACKEND_URL}/applications`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const listBData: any = await listBRes.json();
    if (listBData.applications.length !== 0) {
      throw new Error(`Data leak: User B sees applications! Count: ${listBData.applications.length}`);
    }
    console.log("✔ User B list is empty. Separation verified.");

    // 6. Security Isolation Check: User B attempts to GET User A's application
    console.log("\n6. Security Check: User B attempts to read User A's application directly...");
    const getDirectRes = await fetch(`${BACKEND_URL}/applications/${appAId}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log(`Status returned: ${getDirectRes.status}`);
    if (getDirectRes.status !== 403) {
      throw new Error(`Security breach! User B read User A's application directly. Status: ${getDirectRes.status}`);
    }
    console.log("✔ User B direct read request blocked with 403 Forbidden. Separation verified.");

    // 7. Security Isolation Check: User B attempts to UPDATE User A's application
    console.log("\n7. Security Check: User B attempts to edit User A's application...");
    const updateDirectRes = await fetch(`${BACKEND_URL}/applications/${appAId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenB}`
      },
      body: JSON.stringify({ companyName: 'Hacked Inc' })
    });
    console.log(`Status returned: ${updateDirectRes.status}`);
    if (updateDirectRes.status !== 403) {
      throw new Error(`Security breach! User B updated User A's application. Status: ${updateDirectRes.status}`);
    }
    console.log("✔ User B edit request blocked with 403 Forbidden. Separation verified.");

    // 8. Security Isolation Check: User B attempts to DELETE User A's application
    console.log("\n8. Security Check: User B attempts to delete User A's application...");
    const deleteDirectRes = await fetch(`${BACKEND_URL}/applications/${appAId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log(`Status returned: ${deleteDirectRes.status}`);
    if (deleteDirectRes.status !== 403) {
      throw new Error(`Security breach! User B deleted User A's application. Status: ${deleteDirectRes.status}`);
    }
    console.log("✔ User B delete request blocked with 403 Forbidden. Separation verified.");

    // 9. Dashboard stats check for User A
    console.log("\n9. Fetching Dashboard stats for User A...");
    const statsRes = await fetch(`${BACKEND_URL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const statsData: any = await statsRes.json();
    console.log(`Stats returned: Total=${statsData.total}, Applied=${statsData.stats.Applied}, Interview=${statsData.stats.Interview}`);
    if (statsData.total !== 1 || statsData.stats.Applied !== 1) {
      throw new Error('Stats do not match expectations for User A.');
    }
    console.log('✔ Dashboard statistics verify correctly.');

    // 10. User A updates their own application
    console.log("\n10. User A updates their application status to 'Interview'...");
    const selfUpdateRes = await fetch(`${BACKEND_URL}/applications/${appAId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({ status: 'Interview', notes: 'Interview scheduled for Friday!' })
    });
    if (!selfUpdateRes.ok) throw new Error(`Self update failed: ${await selfUpdateRes.text()}`);
    console.log('✔ Application updated successfully by owner.');

    // 11. User A deletes their own application
    console.log('\n11. User A deletes their application...');
    const selfDeleteRes = await fetch(`${BACKEND_URL}/applications/${appAId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (!selfDeleteRes.ok) throw new Error(`Self delete failed: ${await selfDeleteRes.text()}`);
    console.log('✔ Application deleted successfully by owner.');

    // 12. Final verify empty list
    console.log("\n12. Final verification of empty application list for User A...");
    const finalARes = await fetch(`${BACKEND_URL}/applications`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const finalAData: any = await finalARes.json();
    if (finalAData.applications.length !== 0) {
      throw new Error(`List is not empty after delete. Count: ${finalAData.applications.length}`);
    }
    console.log('✔ Application list is empty. CRUD cycle complete.');

    console.log('\n===================================================');
    console.log('✔✔✔ ALL INTEGRATION AND ISOLATION TESTS PASSED ✔✔✔');
    console.log('===================================================');
  } catch (error: any) {
    console.error('\n❌❌❌ TEST SUITE FAILED ❌❌❌');
    console.error(error.message || error);
    process.exit(1);
  }
}

runTests();

// Test script for students

async function runTest() {
    const apiBase = 'http://localhost:8000/api/v1';
    let cookie = '';
    let xsrfToken = '';

    console.log('1. Fetching CSRF Cookie...');
    const csrfRes = await fetch('http://localhost:8000/sanctum/csrf-cookie', { method: 'GET' });
    const setCookieHeader = csrfRes.headers.get('set-cookie');
    
    if (setCookieHeader) {
        cookie = setCookieHeader.split(',').map(c => c.split(';')[0]).join('; ');
        const match = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
        if (match) {
            xsrfToken = decodeURIComponent(match[1]);
        }
    }
    console.log('XSRF-TOKEN:', xsrfToken ? 'OK' : 'MISSING');

    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': xsrfToken,
            'Cookie': cookie,
            'Referer': 'http://localhost:3000'
        },
        body: JSON.stringify({ email: 'admin@school.com', password: 'password' })
    });
    
    const loginSetCookie = loginRes.headers.get('set-cookie');
    if (loginSetCookie) {
        // Update cookies
        const newCookies = loginSetCookie.split(',').map(c => c.split(';')[0]).join('; ');
        cookie = cookie + '; ' + newCookies;
    }
    
    const loginData = await loginRes.json();
    console.log('Login Result:', loginRes.status, loginData);

    if (loginRes.status !== 200) {
        console.error('Login failed, aborting.');
        return;
    }

    console.log('\n3. Creating a student...');
    const payload = {
        first_name: 'Test',
        last_name: 'Student ' + Date.now(),
        gender: 'M',
        birth_date: '2010-05-15',
        registration_number: 'STD-1234'
    };

    const createRes = await fetch(`${apiBase}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': xsrfToken,
            'Cookie': cookie,
            'Referer': 'http://localhost:3000'
        },
        body: JSON.stringify(payload)
    });
    const createData = await createRes.json();
    console.log('Create Result:', createRes.status, createData);

    console.log('\n4. Fetching students list...');
    const listRes = await fetch(`${apiBase}/students`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': xsrfToken,
            'Cookie': cookie,
            'Referer': 'http://localhost:3000'
        }
    });
    const listData = await listRes.json();
    console.log('List Result:', listRes.status, `Found ${listData.data?.length} students.`);
    if (listData.data?.length > 0) {
        console.log('Latest student:', listData.data[listData.data.length - 1]);
    }
}

runTest().catch(console.error);

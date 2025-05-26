import {test,expect} from '@playwright/test'

test.describe('API test of GoRestAPI', () => {
    // Token
    const token= 'cca63d6b786255b75da982a09170739353809ecca9ec3054a4e526aa27310b2a'
    // Function to generate a random name
    const user_name = "User" + Math.floor(Math.random() * 1000);
    const user_email = user_name + "@15ce.com"; // Generate an email based on the name
    var user_id=7871332;

    test('Save new user info',async({request})=>{        
        const response = await request.post('/public/v2/users',{
            "data": {
                "name": user_name,
                "gender": "male",
                "email": user_email,
                "status": "inactive"
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const response_body= await response.json()
        // console.log(response_body)
        user_id=response_body.id
        // Verify responsen data type
        expect(typeof(response_body.id)).toBe('number')
        expect(typeof(response_body.name)).toBe('string')
        expect(typeof(response_body.email)).toBe('string')
        expect(typeof(response_body.status)).toBe('string')

        //Compare request body data vs response body data
        expect(response_body.name).toEqual(user_name)
        expect(response_body.email).toEqual(user_email)

        // Check status code
        expect(response.status()).toBe(201)
    });
    test('Get user details',async({request})=>{
        const startTime = Date.now();
        const response = await request.get(`/public/v2/users/${user_id}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const response_body= await response.json()
        // console.log(response_body)
        // console.log(`Response time: ${responseTime}ms`);
        
        expect(response.status()).toBe(200)
        // Verify response time
        expect(responseTime).toBeLessThan(500); // Expecting response time to be less than 500 miliseconds
    });
    test('Update user details',async({request})=>{
        const response = await request.patch(`/public/v2/users/${user_id}`,{
            "data": {
                "status": "active"
              },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const response_body= await response.json()
        // console.log(response_body)
        expect(response.status()).toBe(200)
    })
    
    test('Get all user data',async({request})=>{
        const response = await request.get('/public/v2/users?page=1&per_page=90')
        // Parse and log response body
        const responseBody = await response.json();
        // console.log(responseBody);
        // Status code is 200
        expect(response.status()).toBe(200);
        })
 });
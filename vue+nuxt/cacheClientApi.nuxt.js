// 1. Destructure the returned values from the async function useAsyncData
const { error, data, status } = await useAsyncData<any>('profile-settings', async () => {
    
    // 2. Fetch data from two different APIs in parallel using Promise.all
    const [tz, country] = await Promise.all([
        // Fetch timezone data
        $fetch('http://api.timezonedb.com/v2.1/list-time-zone?key=7GIMV3FRPN65&format=json'),
        
        // Fetch country data
        $fetch('https://restcountries.com/v3.1/all')
    ]);

    // 3. Return the fetched data along with the current timestamp
    return {
        tz,             // Timezone data
        country,        // Country data
        fetchedAt: Date.now() // Timestamp of when the data was fetched
    }

}, {
    // 4. Configuration options for the useAsyncData function
    lazy: true,   // Indicate that the data should not be fetched immediately, only when needed
    server: true, // Make sure this fetch works on the server-side as well
    getCachedData: () => {
        
        // 5. Attempt to retrieve cached data from the Nuxt app's payload or static data
        const data = nuxtApp.payload.data['profile-settings'] || nuxtApp.static.data['profile-settings'];

        // 6. If there is no cached data, return undefined (no cache)
        if (!data) {
            return
        }

        // 7. Retrieve the timestamp from the fetched data and create a Date object
        const fetchedDate = new Date(data.fetchedAt);

        // 8. Calculate the expiry date (24 hours after the fetched date)
        const expiryDate = fetchedDate.setTime(fetchedDate.getTime() + 1000 * 60 * 60 * 24);

        // 9. If the current time exceeds the expiry date, return undefined (cache has expired)
        if (Date.now() > expiryDate) {
            return
        }

        // 10. If the cache is still valid, return the cached data
        return data
    }
});


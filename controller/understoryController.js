class understoryController {
    
    static async accessToken(scopes){
        const clientId = process.env.UNDERSTORY_CLIENT;
        const clientSecret = process.env.UNDERSTORY_CLIENT_SECRET;
        const response = await fetch("https://api.auth.understory.io/oauth2/token", {
            method: "POST",
            headers: {
            "User-Agent": "ReLive",
            "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                scope: scopes,
                audience: "https://api.understory.io",
                client_id: clientId,
                client_secret: clientSecret
            })
        });
            
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        return data.access_token;
    }


    static async getBookings(startDate, endDate){
        const accessToken = await this.accessToken('openid booking.read');
        const response = await fetch(`https://api.understory.io/v1/bookings?start_date=${startDate}&end_date=${endDate}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        return data;
    }
}

module.exports = understoryController;

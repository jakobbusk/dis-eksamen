// whoami-loadtest.js
// Hvis I bruger CommonJS:
// const { loadTest } = require('loadtest');
// Hvis I bruger ES modules:
import { loadTest } from 'loadtest';

const hitsPerHost = {};
const statusCodes = {};

const options = {
    url: 'https://relive.pictures/api/whoami',
    maxSeconds: 10,        // kør i 30 sekunder
    concurrency: 25,       // hvor mange "brugere" samtidig
    requestsPerSecond: 30,            // evt. styr hvor hårdt I vil skyde
    method: 'GET',
    keepalive: true,

    statusCallback: (error, result /* , latency */) => {
        if (error) {
        console.error('Request error:', error.message);
        return;
        }

        let hostname = 'unknown';
        try {

            hostname = result.body.toString().trim();
        } catch {
            // hvis det ikke er JSON, så brug body som tekst
            hostname = result.body.toString().trim();
        }

        hitsPerHost[hostname] = (hitsPerHost[hostname] || 0) + 1;
        if (statusCodes[result.statusCode]) {
            statusCodes[result.statusCode] += 1;
        } else {
            statusCodes[result.statusCode] = 1;
        }

    }
};

console.log('Starter loadtest mod', options.url);

loadTest(options, (err, result) => {
    if (err) {
        console.error('Load test error:', err);
        return;
    }

    console.log('\n=== Loadtest summary ===');
    console.log(`Completed requests: ${result.totalRequests}`);
    console.log(`Total errors:       ${result.totalErrors}`);
    console.log(`Mean latency:       ${result.meanLatencyMs} ms`);
    console.log(`RPS (effective):    ${result.rps}\n`);
    console.log('Latency percentiles (ms):');
    console.log(`  50%: ${result.percentiles['50']}ms`);
    console.log(`  90%: ${result.percentiles['90']}ms`);
    console.log(`  95%: ${result.percentiles['95']}ms`);
    console.log(`  99%: ${result.percentiles['99']}ms\n`);

    console.log('=== Hits per hostname ===');
    console.table(hitsPerHost);

    console.log('=== Status codes ===');
    console.table(statusCodes);
});

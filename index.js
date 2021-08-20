// Include the required libraries
const express = require('express');
const { ZBClient } = require('zeebe-node');
const { flattenJSONIntoRAW}  = require('./flattener');

// Load the configuration
const PORT = process.env.PORT || 3000;
const ZEEBE_PROCESS_INSTANCE_VARIABLE_JSON_BODY_KEY = process.env.ZEEBE_PROCESS_INSTANCE_VARIABLE_JSON_BODY_KEY || '_json';
const APP_AUTH_HEADER_SECRET = process.env.APP_AUTH_HEADER_SECRET;
const APP_VAR_PREFIX_HEADER_KEY = process.env.APP_VAR_PREFIX_HEADER_KEY || 'X-Variable-Prefix';

// Create the Zeebe Client, which pulls in ENV configuration.
const zbc = new ZBClient({
    onReady: () => console.log(`Zeebe Connected`),
    onConnectionError: () => console.log(`Zeebe Disconnected`)
});

// Configure the express app
const app = express()

// Simple AUTH Header check middleware
// We only check for the auth header to match what was configured in the environment
app.use((req, res, next) => {
    if (APP_AUTH_HEADER_SECRET && req.header('Authorization') === APP_AUTH_HEADER_SECRET) {
        next();
    } else {
        res.status(401);
        res.send('Unauthenticated');
    }
});

// Force the post body to JSON.
app.use(express.json());

// Simple GET response to show active endpoint for Webhook Publishers
app.get('/process_instances/:bpmnProcessId', (req, res) => {
    res.json({});
})

// Listen for the POST trigger for a given Zeebe bpmn process id
app.post('/process_instances/:bpmnProcessId', async (req, res) => {
    // Let's see about prefixing the instance variables
    const prefix = req.header(APP_VAR_PREFIX_HEADER_KEY);
    const body = (prefix && prefix.length > 0) ?
        flattenJSONIntoRAW({ [prefix]: req.body }) :
        flattenJSONIntoRAW(req.body);

    // Flatten the expected json body, but also include the full JSON
    const variables = {
        [ZEEBE_PROCESS_INSTANCE_VARIABLE_JSON_BODY_KEY]: JSON.stringify(req.body),
        ...body,
    };
    console.log(variables);

    // Make the request to Zeebe
    const result = await zbc.createProcessInstance(req.params.bpmnProcessId, variables);
    console.log(result);

    // Return the Zeebe result as the body
    res.json(result);
})

// Start the app
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})

# zeebe-http-trigger

Allows clients to start a Zeebe Process Instance from an HTTP POST.

# Running the server

```
export ZEEBE_ADDRESS='camunda.cloud.zeebe.api.domain.name:443'
export ZEEBE_CLIENT_ID='...[camunda cloud client id]...'
export ZEEBE_CLIENT_SECRET='...[camunda cloud client secret]...'
export APP_AUTH_HEADER_SECRET='...[secret key]...'
```

Optional config:

```
export PORT=3000
export ZEEBE_PROCESS_INSTANCE_VARIABLE_JSON_BODY_KEY=_json
export APP_VAR_PREFIX_HEADER_KEY='X-Variable-Prefix'
```

# Starting a Process via HTTP

* Post to the path `/process_instances/:bpmnProcessId` where `:bpmnProcessId`
  is the Zeebe Process Id.
* Set the `Authorization` HTTP header value to the auth secret
* Set the `Content-Type` HTTP header to `application/json`
* Optional: `X-Variable-Prefix` HTTP header to prefix Zeebe Instance Variables
  Or use whatever the server was configured by the `APP_VAR_PREFIX_HEADER_KEY`
  environment variable.
* Set the HTTP Post Body to be a JSON string, where the entire
  JSON structure will be flattened to make it easier to reference nested data
  from Zeebe activities/forms. However, a `_json` Zeebe instance variable
  will be also set with the given JSON.


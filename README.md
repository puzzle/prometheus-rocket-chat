# Rocket.Chat Integration for Prometheus Alertmanager

A Rocket.Chat webhook that receives Prometheus Alertmananager alerts, creates concise messages and routes them to the actual channel.

See https://rocket.chat/docs/administrator-guides/integrations/ for details on how to generate Rocket.Chat webhooks.

## Message Format

Rocket.Chat messages produced by this webhook will have the following basic format (based on the keys in the [Alertmanager request](sample-request.json)):

    [annotations.severity OR status] annotations.summary
    annotations.description

You are responsible to put all labels you would like to see into the summary or the description when you define the alert rules for Prometheus. The description is optional, leave it empty if it does not contain additional information.

You may optionally set the label `rocketchat_channel` in the alert rule to route a message to a custom channel.


## Installation

### Rocket.Chat

Login as admin user and go to: Administration => Integrations => New Integration => Incoming WebHook

Set "Enabled" and "Script Enabled" to "True".

Set channel, icons, etc. as you need.

Paste the contents of `webhook.js` into the Script field.

Create Integration. Copy the WebHook URL and proceed to Alertmanager.

### Prometheus Alertmanager

Create a new receiver or modify config of existing one. You'll need to add `webhooks_config` to it. Small example:

    route:
      receiver: rocketchat

    receivers:
      - name: rocketchat
        webhook_configs:
          - send_resolved: true
            url: '${WEBHOOK_URL}'

Reload/restart Alertmanager.

## Testing

To test the webhook, you may send a sample request to your Rocket.Chat instance:

    curl -X POST -H 'Content-Type: application/json' --data-binary @sample-request.json [webhook-url]

## License

prometheus-rocket-chat is released under the terms of the MIT License.
Copyright 2019-2020 Puzzle ITC GmbH. See `LICENSE` for further information.

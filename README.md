# Rocket.Chat Integration for Prometheus Alertmanager

A Rocket.Chat webhook that receives Prometheus Alertmananager alerts, creates concise messages and routes them to the actual channel.

See https://rocket.chat/docs/administrator-guides/integrations/ for details on how to generate Rocket.Chat webhooks.

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
      repeat_interval: 30m
      group_interval: 30m
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
Copyright 2019 Puzzle ITC GmbH. See `LICENSE` for further information.

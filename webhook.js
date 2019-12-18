/*
 * See https://rocket.chat/docs/administrator-guides/integrations/
 */
class Script {
  process_incoming_request({ request }) {
    console.log(request.content);

    // Return a rocket.chat message object.
    // If channel is undefined, the default channel from the webhook configuration is used
    return {
      content: {
        username: "Prometheus Alert",
        attachments: this.getAlerts(request.content),
        channel: request.content.alerts[0].labels.rocketchat_channel
      }
    };
  }

  getAlerts(content) {
    let alertColor = this.getAlertColor(content.status);
    let attachments = [];
    for (i = 0; i < content.alerts.length; i++) {
      let alert = content.alerts[i];

      attachments.push({
        color: alertColor,
        title_link: content.externalURL,
        title: this.getAlertTitle(alert, content.status),
        text: alert.annotations.description
      });
    }
    return attachments;
  }

  getAlertColor(status) {
    let color = "warning";
    if (status === "resolved") {
      color = "good";
    } else if (status === "firing") {
      color = "danger";
    }
    return color;
  }

  getAlertTitle(alert, status) {
    let title = "[" + this.getAlertStatus(alert, status).toUpperCase() + "] ";
    if (!!alert.annotations.summary) {
      title += alert.annotations.summary;
    } else {
      title += alert.labels.alertname + ": " + alert.labels.instance;
    }
    return title;
  }

  getAlertStatus(alert, status) {
    if (status === "firing" && !!alert.annotations.severity) {
      return alert.annotations.severity;
    } else {
      return String(status);
    }
  }

}

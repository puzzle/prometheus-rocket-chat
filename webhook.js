/*
 * This script is maintained at https://github.com/debMan/prometheus-rocket-chat/blob/master/webhook.js
 * See https://rocket.chat/docs/administrator-guides/integrations/ for a how-to.
 */
class Script {
  process_incoming_request({ request }) {
    console.log(request.content);
    return {
      content: {
        username: "Prometheus Alert",
        attachments: this.getAlerts(request.content)
      }
    };
  }

  getAlerts(content) {
    let alertColor = this.getAlertColor(content.status);
    let attachments = [];
    for (i = 0; i < content.alerts.length; i++) {
      let alert = content.alerts[i];
      let expandable_info = [];
      let field_element = {
        title: "alertname: " + alert.labels.alertname,
        value: "*instance:* " + alert.labels.instance,
        short: false
      };
      expandable_info.push(field_element);
      if (!!alert.annotations.summary) {
        expandable_info.push({
          title: "summary",
          value: alert.annotations.summary
        });
      }
      if (!!alert.annotations.severity) {
        expandable_info.push({
          title: "severity",
          value: alert.annotations.severity
        });
      }
      if (!!alert.annotations.description) {
        expandable_info.push({
          title: "description",
          value: alert.annotations.description
        });
      }
      attachments.push({
        color: alertColor,
        title_link: content.externalURL,
        title: this.getAlertTitle(alert, content.status),
        fields: expandable_info,
        text: alert.annotations.description
      });
    }
    return attachments;
  }

  getAlertColor(status) {
    if (status === "resolved") {
      return "good";
    } else if (status === "firing") {
      return "danger";
    } else {
      return "warning";
    }
  }

  getAlertTitle(alert, status) {
    let title = "[" + this.getAlertStatus(alert, status).toUpperCase() + "] ";
    if (!!alert.annotations.summary) {
      title += alert.annotations.summary;
    } else if (!!alert.labels.alertname) {
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

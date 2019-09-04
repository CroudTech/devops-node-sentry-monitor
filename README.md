# Sentry Monitor

This image monitors sentry projects and pushes metrics into newrelic to allow for alerting on error conditions from sentry.

Uses https://github.com/wix/sentry-monitor

## Usage

```
helm upgrade --install croudtech-stable/sentry-monitor --namespace monitoring
```

See chart repository for helm values documentation.
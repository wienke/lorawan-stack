---
title: "API"
description: ""
---

This is the reference for the gRPC and HTTP APIs that {{% tts %}} exposes.

<!--more-->

## HTTP Queries

Additional fields may be specified in HTTP requests by appending them as query string parameters. For example, to request the `name`, `description`, and `locations` of devices in an `EndDeviceRegistry.Get` request, add these fields to the `field_mask` field:

```bash
GET /api/v3/applications/{end_device_ids.application_ids.application_id}/devices/{end_device_ids.device_id}?field_mask=name,description,locations
```

#!/bin/bash
# Firestore backup (requires gcloud CLI)
gcloud firestore export gs://the-poradas-uploads/firestore-backup-$(date +%F)

# GCS backup (requires gsutil)
gsutil -m cp -r gs://the-poradas-uploads ./gcs-backup-$(date +%F)

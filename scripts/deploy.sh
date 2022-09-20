#!/bin/sh

# dev環境
region="asia-northeast1"
projectId="ykoba-dev"
jobName="scraping-youtube-feeds"
graphqlEndpoint="https://graphql-engine-as5o27nftq-an.a.run.app/v1/graphql"

# prod環境
if [ "$#" -eq 1 ] && [ "$1" = "production" ]; then
  projectId="ykoba-dev"
  graphqlEndpoint="https://graphql-engine-as5o27nftq-an.a.run.app/v1/graphql"
fi

gcloud config set project ${projectId} &&
# gcloud builds submit --pack image=gcr.io/${projectId}/${jobName} &&
gcloud builds submit --config cloudbuild.yaml . &&
gcloud beta run jobs update ${jobName} \
  --image gcr.io/${projectId}/${jobName}:latest \
  --region ${region} \
  --set-env-vars "GRAPHQL_ENDPOINT=${graphqlEndpoint}"

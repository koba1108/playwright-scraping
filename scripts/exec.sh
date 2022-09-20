# dev環境
region="asia-northeast1"
projectId="ykoba-dev"
jobName="scraping-youtube-feeds"

# prod環境
if [ "$#" -eq 1 ] && [ "$1" = "production" ]; then
  projectId="ykoba-dev"
fi

gcloud config set project ${projectId} &&
gcloud beta run jobs execute ${jobName} --region ${region}

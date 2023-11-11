## Docker Image

[here](https://hub.docker.com/r/eladhaim22/folder-backuper)

## How to run

docker run -e CRON_EXPRESSION="0 0 \* \* \*" -e BACKUP_PLAN="{source: './test/source', target: './test/backup' }"

## Environments

| Name            | Description                                                   | Type                             | Required | Default value |
| --------------- | ------------------------------------------------------------- | -------------------------------- | -------- | ------------- |
| CRON_EXPRESSION | The cron experssion                                           | string                           | yes      |               |
| BACKUP_PLAN     | At least one object in array with source and target to backup | {source:string, target:string}[] | yes      |               |

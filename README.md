## Docker Image

[eladhaim22/folder-backuper](https://hub.docker.com/r/eladhaim22/folder-backuper)

## Environments

| Name            | Description                                                                                 | Type                                                                          | Required | Default value |
| --------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- | ------------- |
| CRON_EXPRESSION | The cron experssion                                                                         | string                                                                        | yes      |               |
| BACKUP_PLAN     | At least one object in array with source and target to backup retention(days default to 28) | {globExpression:string,baseSource:string, target:string, retention: number}[] | yes      |               |

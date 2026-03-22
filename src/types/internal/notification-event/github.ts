export type GithubNotificationContent = {
  type: 'pull_request.opened';
  repository: string;
  actor: string;
  title: string;
  url: string;
}; // あとで他のイベントも追加

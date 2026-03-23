import type { components } from '@octokit/openapi-types';

export type GithubOpenAPIComponents = components;

type GCS = GithubOpenAPIComponents['schemas'];

export type GithubWebhookPayloadMap = {
  branch_protection_configuration: GCS[Extract<
    keyof GCS,
    | 'webhook-branch-protection-configuration'
    | `webhook-branch-protection-configuration${string}`
  >];
  branch_protection_rule: GCS[Extract<
    keyof GCS,
    | 'webhook-branch-protection-rule'
    | `webhook-branch-protection-rule-${string}`
  >];
  check_run: Extract<
    GCS[Extract<
      keyof GCS,
      'webhook-check-run' | `webhook-check-run-${string}`
    >],
    { action?: string }
  >;
  check_suite: GCS[Extract<
    keyof GCS,
    'webhook-check-suite' | `webhook-check-suite-${string}`
  >];
  code_scanning_alert: GCS[Extract<
    keyof GCS,
    'webhook-code-scanning-alert' | `webhook-code-scanning-alert-${string}`
  >];
  commit_comment: GCS[Extract<
    keyof GCS,
    'webhook-commit-comment' | `webhook-commit-comment-${string}`
  >];
  create: GCS[Extract<
    keyof GCS,
    'webhook-create' | `webhook-create-${string}`
  >];
  custom_property: GCS[Extract<
    keyof GCS,
    'webhook-custom-property' | `webhook-custom-property-${string}`
  >];
  custom_property_values: GCS[Extract<
    keyof GCS,
    | 'webhook-custom-property-values'
    | `webhook-custom-property-values-${string}`
  >];
  delete: GCS[Extract<
    keyof GCS,
    'webhook-delete' | `webhook-delete-${string}`
  >];
  dependabot_alert: GCS[Extract<
    keyof GCS,
    'webhook-dependabot-alert' | `webhook-dependabot-alert-${string}`
  >];
  deploy_key: GCS[Extract<
    keyof GCS,
    'webhook-deploy-key' | `webhook-deploy-key-${string}`
  >];
  deployment: GCS[Extract<
    keyof GCS,
    'webhook-deployment' | `webhook-deployment-${string}`
  >];
  deployment_protection_rule: GCS[Extract<
    keyof GCS,
    | 'webhook-deployment-protection-rule'
    | `webhook-deployment-protection-rule-${string}`
  >];
  deployment_review: GCS[Extract<
    keyof GCS,
    'webhook-deployment-review' | `webhook-deployment-review-${string}`
  >];
  deployment_status: GCS[Extract<
    keyof GCS,
    'webhook-deployment-status' | `webhook-deployment-status-${string}`
  >];
  discussion: GCS[Extract<
    keyof GCS,
    'webhook-discussion' | `webhook-discussion-${string}`
  >];
  discussion_comment: GCS[Extract<
    keyof GCS,
    'webhook-discussion-comment' | `webhook-discussion-comment-${string}`
  >];
  fork: GCS[Extract<keyof GCS, 'webhook-fork' | `webhook-fork-${string}`>];
  github_app_authorization: GCS[Extract<
    keyof GCS,
    | 'webhook-github-app-authorization'
    | `webhook-github-app-authorization-${string}`
  >];
  gollum: GCS[Extract<
    keyof GCS,
    'webhook-gollum' | `webhook-gollum-${string}`
  >];
  installation: GCS[Exclude<
    Extract<
      keyof GCS,
      'webhook-installation' | `webhook-installation-${string}`
    >,
    | `webhook-installation-repositories${string}`
    | `webhook-installation-target${string}`
  >];
  installation_repositories: GCS[Extract<
    keyof GCS,
    | 'webhook-installation-repositories'
    | `webhook-installation-repositories-${string}`
  >];
  installation_target: GCS[Extract<
    keyof GCS,
    'webhook-installation-target' | `webhook-installation-target-${string}`
  >];
  issue_comment: GCS[Extract<
    keyof GCS,
    'webhook-issue-comment' | `webhook-issue-comment-${string}`
  >];
  issue_dependencies: GCS[Extract<
    keyof GCS,
    'webhook-issue-dependencies' | `webhook-issue-dependencies-${string}`
  >];
  issues: GCS[Extract<
    keyof GCS,
    'webhook-issues' | `webhook-issues-${string}`
  >];
  label: GCS[Extract<keyof GCS, 'webhook-label' | `webhook-label-${string}`>];
  marketplace_purchase: GCS[Extract<
    keyof GCS,
    'webhook-marketplace-purchase' | `webhook-marketplace-purchase-${string}`
  >];
  member: GCS[Extract<
    keyof GCS,
    'webhook-member' | `webhook-member-${string}`
  >];
  membership: GCS[Extract<
    keyof GCS,
    'webhook-membership' | `webhook-membership-${string}`
  >];
  merge_group: GCS[Extract<
    keyof GCS,
    'webhook-merge-group' | `webhook-merge-group-${string}`
  >];
  meta: GCS[Extract<keyof GCS, 'webhook-meta' | `webhook-meta-${string}`>];
  milestone: GCS[Extract<
    keyof GCS,
    'webhook-milestone' | `webhook-milestone-${string}`
  >];
  org_block: GCS[Extract<
    keyof GCS,
    'webhook-org-block' | `webhook-org-block-${string}`
  >];
  organization: GCS[Extract<
    keyof GCS,
    'webhook-organization' | `webhook-organization-${string}`
  >];
  package: GCS[Extract<
    keyof GCS,
    'webhook-package' | `webhook-package-${string}`
  >];
  page_build: GCS[Extract<
    keyof GCS,
    'webhook-page-build' | `webhook-page-build-${string}`
  >];
  personal_access_token_request: GCS[Extract<
    keyof GCS,
    | 'webhook-personal-access-token-request'
    | `webhook-personal-access-token-request-${string}`
  >];
  ping: GCS[Extract<keyof GCS, 'webhook-ping' | `webhook-ping-${string}`>];
  project: GCS[Exclude<
    Extract<keyof GCS, 'webhook-project' | `webhook-project-${string}`>,
    `webhook-project-card${string}` | `webhook-project-column${string}`
  >];
  project_card: GCS[Extract<
    keyof GCS,
    'webhook-project-card' | `webhook-project-card-${string}`
  >];
  project_column: GCS[Extract<
    keyof GCS,
    'webhook-project-column' | `webhook-project-column-${string}`
  >];
  projects_v2: GCS[Extract<
    keyof GCS,
    'webhook-projects-v2' | `webhook-projects-v2-${string}`
  >];
  projects_v2_item: GCS[Extract<
    keyof GCS,
    'webhook-projects-v2-item' | `webhook-projects-v2-item-${string}`
  >];
  projects_v2_status_update: GCS[Extract<
    keyof GCS,
    | 'webhook-projects-v2-status-update'
    | `webhook-projects-v2-status-update-${string}`
  >];
  public: GCS[Extract<
    keyof GCS,
    'webhook-public' | `webhook-public-${string}`
  >];
  pull_request: GCS[Exclude<
    Extract<
      keyof GCS,
      'webhook-pull-request' | `webhook-pull-request-${string}`
    >,
    `webhook-pull-request-review${string}`
  >];
  pull_request_review: GCS[Exclude<
    Extract<
      keyof GCS,
      'webhook-pull-request-review' | `webhook-pull-request-review-${string}`
    >,
    | `webhook-pull-request-review-comment${string}`
    | `webhook-pull-request-review-thread${string}`
  >];
  pull_request_review_comment: GCS[Extract<
    keyof GCS,
    | 'webhook-pull-request-review-comment'
    | `webhook-pull-request-review-comment-${string}`
  >];
  pull_request_review_thread: GCS[Extract<
    keyof GCS,
    | 'webhook-pull-request-review-thread'
    | `webhook-pull-request-review-thread-${string}`
  >];
  push: GCS[Extract<keyof GCS, 'webhook-push' | `webhook-push-${string}`>];
  registry_package: GCS[Extract<
    keyof GCS,
    'webhook-registry-package' | `webhook-registry-package-${string}`
  >];
  release: GCS[Extract<
    keyof GCS,
    'webhook-release' | `webhook-release-${string}`
  >];
  repository: GCS[Exclude<
    Extract<keyof GCS, 'webhook-repository' | `webhook-repository-${string}`>,
    | `webhook-repository-advisory${string}`
    | `webhook-repository-dispatch${string}`
    | `webhook-repository-import${string}`
    | `webhook-repository-ruleset${string}`
    | `webhook-repository-vulnerability-alert${string}`
  >];
  repository_advisory: GCS[Extract<
    keyof GCS,
    'webhook-repository-advisory' | `webhook-repository-advisory-${string}`
  >];
  repository_dispatch: GCS[Extract<
    keyof GCS,
    'webhook-repository-dispatch' | `webhook-repository-dispatch-${string}`
  >];
  repository_import: GCS[Extract<
    keyof GCS,
    'webhook-repository-import' | `webhook-repository-import-${string}`
  >];
  repository_ruleset: GCS[Extract<
    keyof GCS,
    'webhook-repository-ruleset' | `webhook-repository-ruleset-${string}`
  >];
  repository_vulnerability_alert: GCS[Extract<
    keyof GCS,
    | 'webhook-repository-vulnerability-alert'
    | `webhook-repository-vulnerability-alert-${string}`
  >];
  secret_scanning_alert: GCS[Exclude<
    Extract<
      keyof GCS,
      | 'webhook-secret-scanning-alert'
      | `webhook-secret-scanning-alert-${string}`
    >,
    `webhook-secret-scanning-alert-location${string}`
  >];
  secret_scanning_alert_location: GCS[Extract<
    keyof GCS,
    | 'webhook-secret-scanning-alert-location'
    | `webhook-secret-scanning-alert-location-${string}`
  >];
  secret_scanning_scan: GCS[Extract<
    keyof GCS,
    'webhook-secret-scanning-scan' | `webhook-secret-scanning-scan-${string}`
  >];
  security_advisory: GCS[Extract<
    keyof GCS,
    'webhook-security-advisory' | `webhook-security-advisory-${string}`
  >];
  security_and_analysis: GCS[Extract<
    keyof GCS,
    'webhook-security-and-analysis' | `webhook-security-and-analysis-${string}`
  >];
  sponsorship: GCS[Extract<
    keyof GCS,
    'webhook-sponsorship' | `webhook-sponsorship-${string}`
  >];
  star: GCS[Extract<keyof GCS, 'webhook-star' | `webhook-star-${string}`>];
  status: GCS[Extract<
    keyof GCS,
    'webhook-status' | `webhook-status-${string}`
  >];
  sub_issues: GCS[Extract<
    keyof GCS,
    'webhook-sub-issues' | `webhook-sub-issues-${string}`
  >];
  team: GCS[Extract<keyof GCS, 'webhook-team' | `webhook-team-${string}`>];
  team_add: GCS[Extract<
    keyof GCS,
    'webhook-team-add' | `webhook-team-add-${string}`
  >];
  watch: GCS[Extract<keyof GCS, 'webhook-watch' | `webhook-watch-${string}`>];
  workflow_dispatch: GCS[Extract<
    keyof GCS,
    'webhook-workflow-dispatch' | `webhook-workflow-dispatch-${string}`
  >];
  workflow_job: GCS[Extract<
    keyof GCS,
    'webhook-workflow-job' | `webhook-workflow-job-${string}`
  >];
  workflow_run: GCS[Extract<
    keyof GCS,
    'webhook-workflow-run' | `webhook-workflow-run-${string}`
  >];
};

export type GithubWebhookEventName = keyof GithubWebhookPayloadMap;

export type GithubWebhookEvent = {
  [K in GithubWebhookEventName]: {
    type: K;
    payload: GithubWebhookPayloadMap[K];
  };
}[GithubWebhookEventName];

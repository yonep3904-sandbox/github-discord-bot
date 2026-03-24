import { Injectable } from '@nestjs/common';
import type {
  GithubWebhookEvent,
  GithubWebhookEventName,
} from '@/types/external/github';
import type {
  GithubNotificationContent,
  FieldItem,
} from '@/types/internal/notification-event';
import type { RGB } from '@/types/utility/scalars';
import { getProperty } from '@/utils/types';

export const supportedEvents: GithubWebhookEventName[] = [
  'issues',
  'issue_comment',
  'pull_request',
  'pull_request_review',
  'pull_request_review_comment',
  'push',
  'commit_comment',
  'release',
  'repository',
  'status',
  'create',
  'delete',
  'fork',
  'workflow_job',
];

export type SupportedEventName = Extract<
  GithubWebhookEventName,
  (typeof supportedEvents)[number]
>;

export type SupportedEvent = Extract<
  GithubWebhookEvent,
  { type: SupportedEventName }
>;

type StatusForColor = 'success' | 'pending' | 'failure' | null;

@Injectable()
export class GithubWebhookNotificationTransformer {
  private readonly maxCommitLines = 10;
  private readonly maxWorkflowJobLines = 20;
  private readonly colorMap = {
    // Base
    default: '#0969DA', // GitHub blue
    unknown: '#6E7781', // muted gray

    // Status
    success: '#2DA44E', // green
    pending: '#BF8700', // amber (少し落ち着かせる)
    failure: '#CF222E', // red

    // Event-specific
    issue: '#0969DA', // blue
    pr: '#8250DF', // purple (GitHub PRカラー)
    push: '#1F883D', // green寄り
    release: '#BC4C00', // orange
    workflow: '#6F42C1', // actions系
  } as const satisfies Record<string, RGB>;

  private readonly eventColorMap: Partial<Record<SupportedEventName, RGB>> = {
    // issue
    issues: this.colorMap.issue,
    issue_comment: this.colorMap.issue,

    // pr
    pull_request: this.colorMap.pr,
    pull_request_review: this.colorMap.pr,
    pull_request_review_comment: this.colorMap.pr,

    // push
    push: this.colorMap.push,

    // release
    release: this.colorMap.release,

    // workflow
    workflow_job: this.colorMap.workflow,
  };

  private readonly supportedEventsSet: Set<SupportedEventName> = new Set(
    supportedEvents,
  );

  transform(event: GithubWebhookEvent): GithubNotificationContent | null {
    if (event.payload == null) {
      return null;
    }

    if (!this.isSupportedEvent(event.type)) {
      return null;
    }

    switch (event.type) {
      case 'issues':
        return this.handleIssues(event);
      case 'issue_comment':
        return this.handleIssueComment(event);
      case 'pull_request':
        return this.handlePullRequest(event);
      case 'pull_request_review':
        return this.handlePullRequestReview(event);
      case 'pull_request_review_comment':
        return this.handlePullRequestReviewComment(event);
      case 'push':
        return this.handlePush(event);
      case 'commit_comment':
        return this.handleCommitComment(event);
      case 'release':
        return this.handleRelease(event);
      case 'repository':
        return this.handleRepository(event);
      case 'status':
        return this.handleStatus(event);
      case 'create':
        return this.handleCreate(event);
      case 'delete':
        return this.handleDelete(event);
      case 'fork':
        return this.handleFork(event);
      case 'workflow_job':
        return this.handleWorkflowJob(event);
      default:
        return this.handleFallback(event);
    }
  }

  private handleIssues(
    event: Extract<SupportedEvent, { type: 'issues' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, issue } = payload;

    return this.createContent({
      event,
      action,
      title: `Issue ${action ?? 'updated'}: ${issue.title ?? 'unknown issue'}`,
      description: issue.body,
      url: issue.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('State', issue.state, true),
        this.createField('Issue #', issue.number, true),
      ],
    });
  }

  private handleIssueComment(
    event: Extract<SupportedEvent, { type: 'issue_comment' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, issue, comment } = payload;

    return this.createContent({
      event,
      action,
      title: `Issue comment ${action ?? 'updated'}: ${issue.title ?? 'unknown issue'}`,
      description: comment.body,
      url: comment.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('Issue #', issue.number, true),
        this.createField('State', issue.state, true),
      ],
    });
  }

  private handlePullRequest(
    event: Extract<SupportedEvent, { type: 'pull_request' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, pull_request: pr } = payload;

    return this.createContent({
      event,
      action,
      title: `Pull request ${action ?? 'updated'}: ${pr.title ?? 'unknown pull request'}`,
      description: pr.body,
      url: pr.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('Base', pr.base.ref, true),
        this.createField('Head', pr.head.ref, true),
        this.createField('State', pr.state, true),
      ],
    });
  }

  private handlePullRequestReview(
    event: Extract<SupportedEvent, { type: 'pull_request_review' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, pull_request: pr, review } = payload;

    return this.createContent({
      event,
      action,
      title: `PR review ${action ?? 'updated'}: ${pr.title ?? 'unknown pull request'}`,
      description: review.body,
      url: review.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('Review State', review.state, true),
        this.createField('PR State', pr.state, true),
      ],
    });
  }

  private handlePullRequestReviewComment(
    event: Extract<SupportedEvent, { type: 'pull_request_review_comment' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, pull_request: pr, comment } = payload;

    return this.createContent({
      event,
      action,
      title: `PR review comment ${action ?? 'updated'}: ${pr.title ?? 'unknown pull request'}`,
      description: comment.body,
      url: comment.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('PR State', pr.state, true),
        this.createField('File', comment.path, true),
        this.createField('Line', comment.line, true),
      ],
    });
  }

  private handlePush(
    event: Extract<SupportedEvent, { type: 'push' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const action = 'push';
    const { commits, ref, compare, head_commit: headCommit } = payload;

    const createCommitSummary = (c: typeof commits) => {
      const commitLines = c.slice(0, this.maxCommitLines).map((commit) => {
        const shortId = commit.id.slice(0, 7);
        const message = commit.message ?? 'no message';
        return `- ${shortId}: ${message}`;
      });
      const moreCount = c.length - commitLines.length;
      const summary = commitLines.length
        ? `${commitLines.join('\n')}${moreCount > 0 ? `\n...and ${moreCount} more` : ''}`
        : headCommit?.message;
      return summary;
    };

    const refName = ref.replace(/refs\/heads\//, '') ?? 'unknown';
    const summary = createCommitSummary(commits);

    return this.createContent({
      event,
      action: action,
      title: `Push to ${refName}`,
      description: summary,
      url: compare ?? headCommit?.url,
      fields: [
        this.createField('Action', action, true),
        this.createField('Ref', refName, true),
        this.createField('Commits', commits.length, true),
      ],
    });
  }

  private handleCommitComment(
    event: Extract<SupportedEvent, { type: 'commit_comment' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, comment } = payload;

    const shortCommitId = comment.commit_id.slice(0, 7);

    return this.createContent({
      event,
      action,
      title: `Commit comment ${action}: ${shortCommitId}`,
      description: comment.body,
      url: comment.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('Commit', shortCommitId, true),
      ],
    });
  }

  private handleRelease(
    event: Extract<SupportedEvent, { type: 'release' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, release } = payload;

    return this.createContent({
      event,
      action,
      title: `Release ${action ?? 'updated'}: ${release.name ?? 'unknown release'}`,
      description: release.body,
      url: release.html_url,
      fields: [
        this.createField('Action', action, true),
        this.createField('Tag', release.tag_name, true),
        this.createField('Target', release.target_commitish, true),
        this.createField('Draft', release.draft ? 'yes' : 'no', true),
        this.createField('Prerelease', release.prerelease ? 'yes' : 'no', true),
        this.createField('Author', release.author?.login, true),
      ],
    });
  }

  private handleRepository(
    event: Extract<SupportedEvent, { type: 'repository' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const { action, repository } = payload;

    return this.createContent({
      event,
      action,
      title: `Repository ${action ?? 'updated'}`,
      description: repository.description,
      url: repository.html_url,
      fields: [this.createField('Action', action, true)],
    });
  }

  private handleStatus(
    event: Extract<SupportedEvent, { type: 'status' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const action = 'status';
    const { state, sha, description, target_url: targetUrl, context } = payload;

    const shortSha = sha.slice(0, 7);
    const statusForColor: StatusForColor =
      (
        {
          success: 'success',
          pending: 'pending',
          failure: 'failure',
          error: 'failure',
        } satisfies Record<typeof state, StatusForColor>
      )[state] ?? null;

    return this.createContent({
      event,
      action: action,
      title: `Commit status ${state}`,
      description: description,
      url: targetUrl,
      fields: [
        this.createField('Context', context, true),
        this.createField('SHA', shortSha, true),
      ],
      status: statusForColor,
    });
  }

  private handleCreate(
    event: Extract<SupportedEvent, { type: 'create' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const action = 'create';

    const { ref, ref_type: refType, description } = payload;

    return this.createContent({
      event,
      action: action,
      title: `Create ${refType}: ${ref}`,
      description: description,
      url: null, // Repository URL
      fields: [
        this.createField('Action', action, true),
        this.createField('Ref Type', refType, true),
        this.createField('Ref', ref, true),
      ],
    });
  }

  private handleDelete(
    event: Extract<SupportedEvent, { type: 'delete' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const action = 'delete';
    const { ref, ref_type: refType } = payload;

    return this.createContent({
      event,
      action: action,
      title: `Delete ${refType}: ${ref}`,
      description: null,
      url: null, // Repository URL
      fields: [
        this.createField('Action', action, true),
        this.createField('Ref Type', refType, true),
        this.createField('Ref', ref, true),
      ],
    });
  }

  private handleFork(
    event: Extract<SupportedEvent, { type: 'fork' }>,
  ): GithubNotificationContent {
    const payload = event.payload;
    const action = 'fork';
    const { forkee } = payload;

    return this.createContent({
      event,
      action: action,
      title: `Repository forked: ${forkee.full_name ?? 'unknown repository'}`,
      description: forkee.description,
      url: forkee.html_url,
      fields: [
        this.createField('Fork', forkee.full_name ?? 'unknown', true),
        this.createField('Owner', forkee.owner.login ?? 'unknown', true),
      ],
    });
  }

  private handleWorkflowJob(
    event: Extract<SupportedEvent, { type: 'workflow_job' }>,
  ): GithubNotificationContent | null {
    const payload = event.payload;
    const action = 'workflow_job';
    const { status } = payload.workflow_job;
    if (status === 'queued' || status === 'in_progress') {
      return null;
    } // Only notify when the workflow job is completed (success, failure, cancelled, etc.)

    const { workflow_job: workflowJob } = payload;

    const createJobSummary = (job: typeof workflowJob) => {
      const stepLines = job.steps
        .slice(0, this.maxWorkflowJobLines)
        .map(
          (step) => `- ${step.name ?? 'step'}: ${step.conclusion ?? 'unknown'}`,
        );
      const moreCount = job.steps.length - stepLines.length;
      return stepLines.length
        ? `${stepLines.join('\n')}${moreCount > 0 ? `\n...and ${moreCount} more steps` : ''}`
        : null;
    };

    const stepSummary = createJobSummary(workflowJob);
    const statusForColor: StatusForColor =
      (
        {
          success: 'success',
          failure: 'failure',
          skipped: 'pending',
          cancelled: 'failure',
          action_required: 'failure',
          neutral: 'pending',
          timed_out: 'failure',
          no_conclusion: 'pending',
        } satisfies Record<
          Exclude<typeof workflowJob.conclusion, null>,
          StatusForColor
        >
      )[workflowJob.conclusion ?? 'no_conclusion'] ?? null;

    return this.createContent({
      event,
      action: action,
      title: `Workflow job: ${workflowJob.name ?? 'unknown job'} ${status}`,
      description: stepSummary,
      url: workflowJob.html_url,
      fields: [
        this.createField('Status', workflowJob.status, true),
        this.createField('Conclusion', workflowJob.conclusion, true),
      ],
      status: statusForColor,
    });
  }

  private handleFallback(event: GithubWebhookEvent): GithubNotificationContent {
    const payload = event.payload;
    const getAction = (payload: unknown): string | undefined => {
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'action' in payload &&
        typeof (payload as { action?: unknown }).action === 'string'
      ) {
        return (payload as { action: string }).action;
      }
      return undefined;
    };

    const action = getAction(payload);

    return this.createContent({
      event,
      action: action ?? 'unknown',
      title: `GitHub event: ${event.type}`,
      description: '',
      url: undefined,
      fields: [this.createField('Action', action ?? 'unknown', true)],
    });
  }

  /**
   * Checks if the event is supported for notification.
   * @param eventName The name of the GitHub webhook event
   * @returns True if the event is supported, false otherwise
   */
  private isSupportedEvent(
    eventName: GithubWebhookEventName,
  ): eventName is SupportedEventName {
    return this.supportedEventsSet.has(eventName as SupportedEventName);
  }

  /**
   * Safely extracts repository information from the payload if it exists and is valid.
   * @param payload The webhook event payload
   * @returns The repository information if it exists and is valid, or undefined otherwise
   */
  private getRepository(payload: unknown): {
    name?: string;
    fullName?: string;
    htmlUrl?: string;
  } {
    const repository = getProperty(payload, 'repository');
    if (repository === undefined) {
      return {};
    }

    const name = getProperty(repository, 'name');
    const fullName = getProperty(repository, 'full_name');
    const htmlUrl = getProperty(repository, 'html_url');

    const nameValid = typeof name === 'string';
    const fullNameValid = typeof fullName === 'string';
    const htmlUrlValid = typeof htmlUrl === 'string';

    return {
      name: nameValid ? name : undefined,
      fullName: fullNameValid ? fullName : undefined,
      htmlUrl: htmlUrlValid ? htmlUrl : undefined,
    };
  }

  private createContent<E extends GithubWebhookEvent>({
    event,
    action,
    title,
    description,
    url,
    fields,
    status,
  }: {
    event: E;
    action: string;
    title: string;
    description: string | null | undefined;
    url: string | null | undefined;
    fields: (FieldItem | null)[];
    status?: StatusForColor;
  }): GithubNotificationContent {
    const payload = event.payload;

    const repository = this.getRepository(payload);

    const actor = payload.sender
      ? {
          login: payload.sender.login,
          url: payload.sender.html_url,
          avatarUrl: payload.sender.avatar_url,
        }
      : undefined;

    const repositoryUrl = repository.htmlUrl;

    return {
      type: event.type,
      action,

      title,
      description: description ?? undefined,
      url: url ?? repositoryUrl ?? undefined,

      repository,
      actor,
      timestamp: event.timestamp,
      color: this.resolveEventColor(event.type, status),
      fields: fields.filter(
        (field: FieldItem | null): field is FieldItem => !!field,
      ),
    };
  }

  private resolveEventColor(
    event: GithubWebhookEventName,
    status?: StatusForColor,
  ): RGB {
    if (!this.isSupportedEvent(event)) {
      return this.colorMap.unknown;
    }

    if (status !== undefined) {
      if (status === null) {
        return this.colorMap.default;
      } else {
        return this.colorMap[status];
      }
    }
    return this.eventColorMap[event] ?? this.colorMap.default;
  }

  private createField(
    name: string,
    value: string | number | boolean | null | undefined,
    inline: boolean = false,
  ): FieldItem | null {
    if (value === undefined) {
      return null;
    }
    return {
      name,
      value: String(value),
      inline,
    };
  }
}

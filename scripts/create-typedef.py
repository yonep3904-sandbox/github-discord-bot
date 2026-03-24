from pathlib import Path

template = """\
import type { components } from '@octokit/openapi-types';
import type { ISO8601 } from '@/types/utility/scalars';

export type GithubOpenAPIComponents = components;

type GCS = GithubOpenAPIComponents['schemas'];

export type GithubWebhookPayloadMap = {{__REPLACE__}};

export type GithubWebhookEventName = keyof GithubWebhookPayloadMap;

export type GithubWebhookEvent = {
  [K in GithubWebhookEventName]: {
    type: K;
    payload: GithubWebhookPayloadMap[K];
    timestamp: ISO8601;
  };
}[GithubWebhookEventName];
"""

DIR = Path(__file__).parent

keys_file = DIR / "events.txt"
output_file = DIR / "github.ts"

def main():
    keys = keys_file.read_text(encoding="utf-8").splitlines()
    entries = [f"{key}: GCS[Extract<keyof GCS, ''>]" for key in keys]
    payload_map = "{\n  " + ",\n  ".join(entries) + "\n}"
    output_code = template.replace("{{__REPLACE__}}", payload_map)
    output_file.write_text(output_code, encoding="utf-8")

if __name__ == "__main__":
    main()

from pathlib import Path
import re


DIR = Path(__file__).parent

def extract_schema_keys(ts_code: str) -> list[str]:
    # "schemas:" の位置を探す
    match = re.search(r'schemas\s*:\s*{', ts_code)
    if not match:
        return []

    start = match.end()  # '{' の直後

    # 波括弧の対応を追跡して schemas ブロック全体を取得
    brace_count = 1
    i = start
    while i < len(ts_code) and brace_count > 0:
        if ts_code[i] == '{':
            brace_count += 1
        elif ts_code[i] == '}':
            brace_count -= 1
        i += 1

    schemas_block = ts_code[start:i - 1]

    # schemas直下のキーを抽出
    # 例:
    #   Foo: {...}
    #   "bar-baz": ...
    key_pattern = re.compile(r'''
        ^\s*
        (?:
            "([^"]+)"     # "quoted-key"
            |
            ([A-Za-z0-9_\-]+)  # unquoted-key
        )
        \s*:
    ''', re.MULTILINE | re.VERBOSE)

    keys = []
    for m in key_pattern.finditer(schemas_block):
        key = m.group(1) or m.group(2)
        keys.append(key)

    return keys


def main(input_path: Path, output_path: Path):
    ts_code = input_path.read_text(encoding="utf-8")
    keys = extract_schema_keys(ts_code)
    webhook_keys = [key for key in keys if key.startswith("webhook-")]
    webhook_keys = [f"| '{key}'" for key in webhook_keys]

    # 出力（1行1キー）
    output_path.write_text("\n".join(webhook_keys), encoding="utf-8")


if __name__ == "__main__":
    # 例:
    input_file = DIR / "a.txt"
    output_file = DIR / "schema_keys.txt"

    main(input_file, output_file)

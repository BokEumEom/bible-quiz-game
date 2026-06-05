#!/usr/bin/env bash
# PreToolUse hook: 생성물(dist/, node_modules/) 직접 편집을 차단한다.
# stdin 으로 들어온 tool 입력 JSON 에서 파일 경로를 읽어 검사한다.
# 차단하려면 exit 2 + stderr 메시지 (Claude 에게 전달됨).

input=$(cat)
path=$(printf '%s' "$input" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"file_path"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')

case "$path" in
  */dist/*|dist/*|*/node_modules/*|node_modules/*)
    echo "차단됨: '$path' 는 빌드 생성물입니다. src/ 의 소스 파일을 수정하세요." >&2
    exit 2
    ;;
esac

exit 0

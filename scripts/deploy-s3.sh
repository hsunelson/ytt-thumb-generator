#!/usr/bin/env bash
#
# Deploys the static export in ./out to an S3 bucket.
#
# Configure via environment variables (or edit the defaults below):
#   S3_BUCKET   - target bucket name (required), e.g. my-thumb-tool
#   AWS_REGION  - bucket region, e.g. us-east-1
#   AWS_PROFILE - (optional) named AWS CLI profile to use
#
# Run `npm run build` first (the `deploy` npm script does this for you).
set -euo pipefail

S3_BUCKET="${S3_BUCKET:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"

if [[ -z "$S3_BUCKET" ]]; then
  echo "ERROR: set S3_BUCKET (e.g. S3_BUCKET=my-bucket npm run deploy)" >&2
  exit 1
fi

if [[ ! -d out ]]; then
  echo "ERROR: ./out not found. Run 'npm run build' first." >&2
  exit 1
fi

PROFILE_ARG=()
if [[ -n "${AWS_PROFILE:-}" ]]; then
  PROFILE_ARG=(--profile "$AWS_PROFILE")
fi

echo "Syncing ./out -> s3://$S3_BUCKET (region: $AWS_REGION)"

# Long-cache hashed assets; never cache the HTML so new deploys show up.
aws s3 sync out/ "s3://$S3_BUCKET" \
  --region "$AWS_REGION" "${PROFILE_ARG[@]}" \
  --delete \
  --exclude "*.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync out/ "s3://$S3_BUCKET" \
  --region "$AWS_REGION" "${PROFILE_ARG[@]}" \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache" \
  --content-type "text/html"

echo "Done."

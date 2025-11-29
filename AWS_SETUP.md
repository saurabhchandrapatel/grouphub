# AWS S3 Deployment Setup for GroupHub

## Prerequisites

### 1. AWS S3 Bucket Configuration
Create an S3 bucket named `grouphub.akte.in` with:
- Static website hosting enabled
- Index document: `index.html`
- Error document: `index.html` (for SPA routing)
- Public read access

### 2. CloudFront Distribution (Optional but Recommended)
- Origin: S3 bucket `grouphub.akte.in`
- Custom domain: `grouphub.akte.in`
- SSL certificate for `*.akte.in`
- Default root object: `index.html`
- Error pages: 404 → `/index.html` (200 response)

### 3. Route 53 DNS Configuration
- A record: `grouphub.akte.in` → CloudFront distribution
- Or CNAME: `grouphub.akte.in` → S3 website endpoint

## GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id (optional)
```

## IAM Policy for GitHub Actions

Create an IAM user with this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::grouphub.akte.in",
                "arn:aws:s3:::grouphub.akte.in/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation"
            ],
            "Resource": "*"
        }
    ]
}
```

## Deployment Process

1. Push to `main` branch triggers automatic deployment
2. Build creates optimized production bundle
3. Files sync to S3 bucket
4. CloudFront cache invalidation (if configured)
5. Site available at https://grouphub.akte.in
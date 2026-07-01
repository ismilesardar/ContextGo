/**
 * Backblaze B2 storage client — S3-compatible API wrapper.
 * Server-only module — never import in client components.
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Agent as HttpsAgent } from 'https';
import {
  S3_ENDPOINT,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET
} from '@/config/url.config';

// ── Client (lazy singleton) ───────────────────────────────────────

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY
      },
      forcePathStyle: true, // Required for Backblaze B2
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 15_000,
        requestTimeout: 60_000,
        httpsAgent: new HttpsAgent({
          family: 4, // Force IPv4 — B2's IPv6 is unreachable on some networks
          keepAlive: true
        })
      }),
      maxAttempts: 2
    });
  }
  return _client;
}

// ── Public API ─────────────────────────────────────────────────────

/**
 * Upload a file to the private B2 bucket.
 * Returns the internal path (not a public URL).
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | Blob,
  contentType = 'image/jpeg'
): Promise<string> {
  const client = getClient();

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );

  return key;
}

/**
 * Read a file from B2 and return its bytes + content type.
 * Used by the authenticated image proxy route.
 */
export async function getFile(
  key: string
): Promise<{ body: Buffer; contentType: string } | null> {
  const client = getClient();

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
      })
    );

    const body = await response.Body?.transformToByteArray();
    if (!body) return null;

    return {
      body: Buffer.from(body),
      contentType: response.ContentType || 'application/octet-stream'
    };
  } catch (error: unknown) {
    // If file doesn't exist, return null
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name: string }).name === 'NoSuchKey'
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * Delete a single file from B2.
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getClient();

  await client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    })
  );
}

/**
 * Delete multiple files from B2 in one request.
 * Use for cleanup when a record or module is deleted.
 */
export async function deleteFiles(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const client = getClient();

  await client.send(
    new DeleteObjectsCommand({
      Bucket: S3_BUCKET,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: true
      }
    })
  );
}

/**
 * Generate a pre-signed URL for a B2 object that expires in 10 minutes.
 * Used to give FLUX API temporary access to private images.
 */
export async function getSignedB2Url(key: string): Promise<string> {
  const client = getClient();

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key
  });

  return getSignedUrl(client as any, command as any, { expiresIn: 600 });
}

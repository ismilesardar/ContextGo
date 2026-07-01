/**
 * POST /api/workspaces/logo — Upload a workspace logo to B2
 * GET  /api/workspaces/logo?path=... — Serve the logo image from B2
 *
 * Auth required: any authenticated user (withAuth).
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import { uploadFile, getFile } from '@/lib/storage/b2-client';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
}

const uploadHandler: ApiHandler = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', code: 'missing_file' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Accepted: JPEG, PNG, WEBP, GIF',
          code: 'invalid_file_type'
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${(file.size / 1024).toFixed(0)}KB) exceeds the 2MB limit`,
          code: 'file_too_large'
        },
        { status: 400 }
      );
    }

    const safeName = sanitizeFileName(file.name);
    const key = `logos/${Date.now()}-${safeName}`;

    const bytes = await file.arrayBuffer();
    await uploadFile(key, Buffer.from(bytes), file.type);

    return NextResponse.json({ path: key });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo', code: 'upload_error' },
      { status: 500 }
    );
  }
};

export const POST = withAuth(uploadHandler);

const serveHandler: ApiHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter', code: 'missing_path' },
        { status: 400 }
      );
    }

    const decodedPath = decodeURIComponent(path);
    const file = await getFile(decodedPath);

    if (!file) {
      return NextResponse.json(
        { error: 'Logo not found', code: 'not_found' },
        { status: 404 }
      );
    }

    return new NextResponse(file.body, {
      headers: {
        'Content-Type': file.contentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Logo serve error:', error);
    return NextResponse.json(
      { error: 'Failed to serve logo', code: 'proxy_error' },
      { status: 500 }
    );
  }
};

export const GET = withAuth(serveHandler);

// ── DELETE: Remove a logo from B2 ─────────────────────────────

const deleteHandler: ApiHandler = async (req, context) => {
  try {
    const { path } = context.body || {};
    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'Missing path', code: 'missing_path' },
        { status: 400 }
      );
    }

    const { deleteFile } = await import('@/lib/storage/b2-client');
    await deleteFile(path);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logo delete error:', error);
    return NextResponse.json({ success: true }); // Best-effort
  }
};

export const DELETE = withAuth(deleteHandler);

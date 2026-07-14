import type { MediaItem } from '@/lib/content/types';

/**
 * EMPTY. The media page shows an honest "coming soon" state until there are real photographs
 * and videos of real work.
 *
 * TO FILL IN — a photo:
 *   {
 *     id: 'media-001',
 *     kind: 'photo',
 *     image: { src: '/images/media/example.jpg', alt: 'Describe what is in the photo', width: 1600, height: 1067 },
 *     caption: 'What this shows',
 *     order: 1,
 *   }
 *
 * TO FILL IN — a video (linked, never embedded: an embedded iframe would load about a megabyte
 * of third-party JavaScript before anyone pressed play):
 *   {
 *     id: 'media-002',
 *     kind: 'video',
 *     video: { provider: 'youtube', id: 'YOUTUBE_VIDEO_ID', title: 'Video title' },
 *     caption: 'What this shows',
 *     order: 2,
 *   }
 */
export const media: MediaItem[] = [];

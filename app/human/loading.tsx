/**
 * Loading State for Human Interview Room Page
 * 
 * Purpose: Displayed while /human page data is being fetched
 * Uses Next.js 14 App Router automatic loading UI feature
 * 
 * This file imports the actual loading component from components/human
 * to maintain Next.js App Router convention (loading.tsx must be in app directory)
 * 
 * Moved implementation to: components/human/HumanRoomListLoading.tsx (January 16, 2026)
 */

import HumanRoomListLoading from "@/components/human/HumanRoomListLoading";

export default HumanRoomListLoading;

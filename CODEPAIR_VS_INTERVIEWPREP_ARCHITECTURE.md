# CodePair vs InterviewPrep: Architecture Gap Analysis

**Document Type:** Production-Level Architecture Comparison  
**Date:** January 16, 2026  
**Branch:** `feature/new-theme`  
**Purpose:** Comprehensive analysis of architectural differences between reference codebase (codepair) and current project (InterviewPrep)

---

## HONEST COMPREHENSIVE ASSESSMENT

### What I've Learned About `codepair/`

**codepair** is a **complete, production-grade interview platform** built with a **completely different architecture** than your InterviewPrep project:

| Aspect | codepair (Reference) | InterviewPrep (Your Project) |
|--------|---------------------|------------------------------|
| **Frontend Framework** | React 18 + Vite (SPA) | Next.js 14 (SSR/App Router) |
| **Backend** | Go (Fiber) with 2 services | Next.js API Routes + Server Actions |
| **Real-time** | Custom WebSocket + WebRTC (Pion) | Stream SDK (3rd party) |
| **Database** | (Likely PostgreSQL via Go) | Drizzle + PostgreSQL |
| **Authentication** | Custom JWT | NextAuth.js |
| **Code Execution** | Direct WebSocket sync | Piston API |

### **CRITICAL HONEST TRUTH:**

The MICROSCOPIC_ANALYSIS.md, FRONTEND_BLUEPRINT_PART1.md, and FRONTEND_BLUEPRINT_PART2.md documents describe **codepair's implementation**, NOT a generic blueprint that can be copy-pasted.

**What can be learned and applied to your project:**

1. ✅ **Design Tokens (IBM Carbon)** - The color palette, spacing system, typography can be adopted
2. ✅ **Component Patterns** - Toast system design, modal patterns, form validation approaches
3. ✅ **CSS Architecture** - The utility classes, scrollbar styling, autofill handling
4. ✅ **UX Patterns** - Rate limiting approach, clipboard API usage, loading states
5. ⚠️ **Layout Structure** - The `h-screen flex` pattern can work, but sidebar implementation differs

**What CANNOT be directly applied:**

1. ❌ **WebRTC Implementation** - codepair has a **Go backend with Pion WebRTC server** (`peer-cp/server/webrtc.go`). Your project uses Stream SDK.
2. ❌ **Real-time Editor Sync** - codepair has a **custom WebSocket server** (`peer-cp/server/editor.go`). You don't have this infrastructure.
3. ❌ **Authentication Flow** - codepair's token-based room access is different from your NextAuth pattern

### **Architecture Comparison (Honest)**

```
codepair Architecture:
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  client-cp      │────▶│    core-cp      │────▶│   PostgreSQL    │
│  (React/Vite)   │     │  (Go/Fiber)     │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         │ WebSocket
         ▼
┌─────────────────┐
│    peer-cp      │ ◀── WebRTC signaling + Editor sync
│  (Go/Fiber)     │     Custom real-time server
└─────────────────┘

Your InterviewPrep Architecture:
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  API Routes +   │────▶│   PostgreSQL    │
│   (React SSR)   │     │ Server Actions  │     │   (Drizzle)     │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         │ SDK Integration
         ▼
┌─────────────────┐
│   Stream SDK    │ ◀── Video/Audio via 3rd party service
│  (3rd Party)    │     No custom WebSocket/WebRTC
└─────────────────┘
```

### **What This Means for P2**

The COMPREHENSIVE_AUDIT.md audit correctly identified that **P2.1 (WebRTC) and P2.2 (Real-time collaboration) require backend infrastructure** - because it was based on codepair's architecture which HAS that infrastructure.

**Your project DOES NOT have:**
- A WebSocket server (peer-cp equivalent)
- A WebRTC signaling server
- Real-time synchronization backend

**Options going forward:**

1. **Use Stream SDK capabilities** - Stream provides some real-time features, but not code editor sync
2. **Add a WebSocket service** - Would require building/deploying a separate service
3. **Use a real-time collaboration service** - Like Liveblocks, Yjs, Firebase
4. **Scope down P2.1/P2.2** - Focus on what's achievable with current infrastructure

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architectural Comparison](#architectural-comparison)
3. [Technology Stack Analysis](#technology-stack-analysis)
4. [P2 Gap Analysis](#p2-gap-analysis)
5. [Infrastructure Requirements](#infrastructure-requirements)
6. [Implementation Feasibility Assessment](#implementation-feasibility-assessment)
7. [Recommended Path Forward](#recommended-path-forward)

---

## 1. Executive Summary

### Key Finding

**The COMPREHENSIVE_AUDIT.md P2 requirements (WebRTC video collaboration and real-time code collaboration) are based on codepair's architecture, which has a completely different technology stack and infrastructure than InterviewPrep.**

### Critical Differences

| Component | codepair | InterviewPrep | Impact on P2 |
|-----------|----------|---------------|--------------|
| **Backend Language** | Go (Gin/Fiber) | TypeScript (Next.js) | CRITICAL - No Go runtime |
| **WebSocket Server** | Custom (peer-cp) | None | CRITICAL - Required for P2.1/P2.2 |
| **WebRTC** | Pion (Go library) | Stream SDK | CRITICAL - Different implementation |
| **Real-time Sync** | Custom WebSocket protocol | None | CRITICAL - Required for P2.2 |
| **Deployment** | Multi-service (Docker Compose) | Single Next.js app | HIGH - Infrastructure complexity |
| **Database Access** | GORM (Go ORM) | Drizzle (TypeScript ORM) | MEDIUM - Different patterns |

### Architecture Classification

**codepair:** Microservices architecture with dedicated real-time services  
**InterviewPrep:** Monolithic Next.js application with 3rd-party integrations

---

## 2. Architectural Comparison

### 2.1 codepair Architecture (Reference Codebase)

#### Service Breakdown

```
codepair/
├── client-cp/          # React 18 + Vite Frontend (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/      # useWebRTC, useEditorPeer, useChat, useNotesPeer
│   │   ├── context/    # ToastContext
│   │   ├── routes/     # TanStack Router
│   │   └── services/   # API clients
│   └── package.json    # Vite, React 18, TypeScript
│
├── core-cp/            # Go Backend - HTTP API (Port 8080)
│   ├── cmd/main.go     # Gin HTTP server
│   ├── internal/
│   │   ├── handlers/   # Auth, Room, User handlers
│   │   ├── service/    # Business logic
│   │   ├── repository/ # PostgreSQL access (GORM)
│   │   └── middleware/ # JWT, CORS, Logging
│   └── config.yaml     # Database, JWT, Server config
│
└── peer-cp/            # Go Backend - WebSocket/WebRTC (Port 8081)
    ├── server/
    │   ├── server.go   # Main WebSocket server
    │   ├── webrtc.go   # Pion WebRTC implementation (162 lines)
    │   ├── editor.go   # Code editor synchronization (68 lines)
    │   ├── chat.go     # Real-time chat
    │   └── notes.go    # Collaborative notes
    └── client/         # HTTP client to core-cp
```

#### Real-time Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Video    │  │   Editor   │  │    Chat    │           │
│  │  WebRTC    │  │ WebSocket  │  │ WebSocket  │           │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘           │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          │ WebSocket      │ WebSocket      │ WebSocket
          │ ws://peer:8081 │ ws://peer:8081 │ ws://peer:8081
          │                │                │
┌─────────▼────────────────▼────────────────▼────────────────┐
│              peer-cp (Go Fiber Server)                     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  WebRTC Handler (webrtc.go)                      │     │
│  │  - Pion WebRTC library                           │     │
│  │  - SDP offer/answer exchange                     │     │
│  │  - ICE candidate handling                        │     │
│  │  - STUN server: stun.l.google.com:19302         │     │
│  │  - Maintains RTCPeerConnection per client        │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Editor Sync Handler (editor.go)                 │     │
│  │  - Code synchronization                          │     │
│  │  - Language selection broadcast                  │     │
│  │  - Cursor position sync (planned)                │     │
│  │  - Room state management                         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Chat Handler (chat.go)                          │     │
│  │  - Message broadcasting                          │     │
│  │  - Chat history (1000 messages per room)         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Notes Handler (notes.go)                        │     │
│  │  - Collaborative notes sync                      │     │
│  │  - TipTap editor content                         │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │
          │ HTTP REST API
          │ (Room validation, token verification)
          │
┌─────────▼─────────────────────────────────────────────────┐
│               core-cp (Go Gin Server)                      │
│                                                             │
│  - User authentication (JWT)                               │
│  - Room CRUD operations                                    │
│  - PostgreSQL database (GORM)                              │
│  - Token generation for room access                        │
└─────────────────────────────────────────────────────────────┘
```

#### Key Implementation Details

**peer-cp/server/webrtc.go (Critical for P2.1):**
```go
// Line 23-28: PeerConnection configuration
func (s *Server) createPeerConnection() (*RTCPeerConnection, error) {
    config := webrtc.Configuration{
        ICEServers: []webrtc.ICEServer{
            {URLs: []string{s.config.Server.StunServerURL}},
        },
    }
    
    // Line 42-54: Media transceivers setup
    pc.AddTransceiverFromKind(webrtc.RTPCodecTypeVideo, 
        webrtc.RTPTransceiverInit{
            Direction: webrtc.RTPTransceiverDirectionSendrecv,
        })
    pc.AddTransceiverFromKind(webrtc.RTPCodecTypeAudio, 
        webrtc.RTPTransceiverInit{
            Direction: webrtc.RTPTransceiverDirectionSendrecv,
        })
}

// Line 61-104: SDP offer/answer exchange
func (s *Server) handleSDP(ctx context.Context, client *WebRTCClient, 
                          sdp map[string]interface{}) error {
    // Parse SDP, create answer, set local/remote descriptions
    // This is the WebRTC signaling protocol
}
```

**peer-cp/server/editor.go (Critical for P2.2):**
```go
// Line 24-64: Real-time code synchronization
func (s *Server) handleEditorMessage(ctx context.Context, c *websocket.Conn, 
                                     roomID string, msg EditorMessage) {
    room := s.rooms[roomID]
    
    switch msg.Type {
    case "code":
        room.currentCode = msg.Code      // Update room state
        room.language = msg.Language
        // Broadcast to all other clients in room
        for client := range room.editorClients {
            if client != c {
                client.WriteMessage(websocket.TextMessage, messageJSON)
            }
        }
    }
}
```

**client-cp/src/hooks/useWebRTC.ts (410 lines):**
```typescript
// Complex WebRTC state management
const peerConnection = useRef<RTCPeerConnection | null>(null);
const ws = useRef<WebSocket | null>(null);
const localStream = useRef<MediaStream | null>(null);
const remoteStream = useRef<MediaStream>(new MediaStream());
const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

// getUserMedia, createPeerConnection, ICE handling, etc.
```

**client-cp/src/hooks/useEditorPeer.ts (102 lines):**
```typescript
// Real-time editor synchronization
const [code, setCode] = useState("// Start coding...");
const [language, setLanguage] = useState("javascript");
const prevCodeRef = useRef(code);  // Prevents infinite loops

const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined && value !== prevCodeRef.current) {
        setCode(value);
        sendUpdate(value, language);  // WebSocket broadcast
        prevCodeRef.current = value;
    }
}, [language, sendUpdate]);
```

---

### 2.2 InterviewPrep Architecture (Current Project)

#### Service Breakdown

```
InterviewPrep/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API Routes (REST)
│   │   ├── auth/            # NextAuth.js
│   │   ├── get-code/        # Piston API proxy
│   │   ├── upload/          # AWS S3
│   │   └── ...
│   ├── human-rooms/[roomId]/ # Interview room page
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── code-editor/
│   │   ├── code-editor-block.tsx  # Monaco Editor (NO WebSocket)
│   │   ├── output.tsx             # Code execution output
│   │   └── language-selector.tsx
│   └── human/
│       ├── video-player.tsx       # Stream SDK integration
│       └── HumanRoomContent.tsx
│
├── utils/
│   ├── db.ts                # Drizzle ORM (PostgreSQL)
│   └── schema.ts
│
├── data-access/
│   └── human-rooms.ts       # Server-side data fetching
│
└── lib/
    ├── auth.ts              # NextAuth configuration
    └── storage.ts           # AWS S3
```

#### Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Client (Browser)                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Video    │  │   Editor   │  │  Execution │           │
│  │ Stream SDK │  │   Monaco   │  │   Piston   │           │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘           │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          │ SDK API        │ NO SYNC        │ HTTP POST
          │ (Stream.io)    │ (Local only)   │ /api/get-code
          │                │                │
          │                │                │
┌─────────▼────────────────▼────────────────▼────────────────┐
│              Next.js Server (Port 3000)                     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  API Routes (app/api/)                           │     │
│  │  - /api/get-code → Piston API (HTTP)            │     │
│  │  - /api/auth/[...nextauth] → NextAuth           │     │
│  │  - /api/upload → AWS S3                          │     │
│  │  - NO WebSocket endpoints                        │     │
│  │  - NO WebRTC signaling                           │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Server Actions (app/human-rooms/[roomId]/)      │     │
│  │  - generateTokenAction (Stream SDK)               │     │
│  │  - getHumanRoomById (Drizzle query)              │     │
│  │  - NO real-time sync actions                     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Database Access (Drizzle ORM)                   │     │
│  │  - PostgreSQL (Neon serverless)                  │     │
│  │  - utils/db.ts, utils/schema.ts                  │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │
          │ External Services
          │
          ├──▶ Stream.io (Video/Audio via SDK)
          ├──▶ Piston API (Code execution)
          └──▶ AWS S3 (File storage)
```

#### Key Missing Components for P2

**❌ NO WebSocket Server:**
- No equivalent to `peer-cp/server/server.go`
- No WebSocket endpoint setup
- Cannot broadcast messages to multiple clients in real-time

**❌ NO WebRTC Signaling:**
- Uses Stream SDK (3rd party) for video/audio
- Stream SDK handles WebRTC internally
- Cannot customize WebRTC behavior
- No access to raw `RTCPeerConnection`

**❌ NO Real-time Editor Sync:**
- Monaco Editor is local only (`components/code-editor/code-editor-block.tsx`)
- No `useEditorPeer` hook equivalent
- No WebSocket connection for code synchronization
- Each user sees only their own code changes

**❌ NO Room State Management:**
- No in-memory room state like codepair's `Room` struct
- Room data fetched from database on page load
- No live presence tracking
- No shared state between clients

---

## 3. Technology Stack Analysis

### 3.1 Frontend Comparison

| Feature | codepair | InterviewPrep | Migration Effort |
|---------|----------|---------------|------------------|
| **Framework** | React 18 + Vite (SPA) | Next.js 14 (SSR) | N/A - Keep Next.js |
| **Routing** | TanStack Router | App Router | N/A - Keep App Router |
| **State Management** | useState + useRef | useState + useRef | ✅ Same |
| **Styling** | Tailwind CSS | Tailwind CSS | ✅ Same |
| **Code Editor** | Monaco Editor | Monaco Editor | ✅ Same |
| **Video** | Custom WebRTC | Stream SDK | ❌ Different |
| **Real-time Hooks** | useWebRTC, useEditorPeer | None | ❌ Missing |
| **WebSocket Client** | Native WebSocket API | None | ❌ Missing |

### 3.2 Backend Comparison

| Feature | codepair | InterviewPrep | Migration Effort |
|---------|----------|---------------|------------------|
| **Language** | Go 1.22+ | TypeScript (Node.js) | HIGH - Cannot use Go code |
| **HTTP Server** | Gin (core-cp) | Next.js API Routes | MEDIUM - Different patterns |
| **WebSocket Server** | Fiber (peer-cp) | None | HIGH - Need to build |
| **WebRTC Library** | Pion (Go) | N/A | HIGH - Need JS alternative |
| **Database ORM** | GORM | Drizzle | MEDIUM - Different APIs |
| **Authentication** | Custom JWT | NextAuth.js | MEDIUM - Different patterns |
| **Middleware** | Custom Go middleware | Next.js middleware | MEDIUM - Different APIs |

### 3.3 Infrastructure Comparison

| Component | codepair | InterviewPrep | Deployment Impact |
|-----------|----------|---------------|-------------------|
| **Services** | 3 services (client, core, peer) | 1 service (Next.js) | HIGH - Need multi-service setup |
| **Ports** | 5173 (client), 8080 (core), 8081 (peer) | 3000 (Next.js) | HIGH - Need port management |
| **Container** | Docker Compose (3 containers) | Single container (Vercel) | HIGH - Cannot use Docker Compose on Vercel |
| **Database** | PostgreSQL (direct) | Neon serverless | MEDIUM - Connection pooling |
| **STUN Server** | stun.l.google.com:19302 | N/A | LOW - Can use same |

### 3.4 Dependency Analysis

**codepair client-cp/package.json:**
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",      // ✅ Same
    "@tanstack/react-query": "^5.66.0",    // ✅ Same
    "@tanstack/react-router": "^1.63.5",   // ❌ Different (uses App Router)
    "@tiptap/react": "^2.11.5",            // ⚠️ Not used in InterviewPrep
    "axios": "^1.7.9",                     // ✅ Same
    "react": "^18.3.1",                    // ✅ Same
    // NO WebRTC library (native browser API)
  }
}
```

**InterviewPrep package.json:**
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",           // ✅ Same
    "@stream-io/video-react-sdk": "^1.2.20",    // ❌ Different (3rd party)
    "@tanstack/react-query": "^5.51.23",        // ✅ Same
    "next": "14.2.5",                           // ❌ Different (Next.js)
    "next-auth": "^4.24.7",                     // ❌ Different (NextAuth)
    "drizzle-orm": "^0.32.2",                   // ❌ Different (Drizzle)
    "axios": "^1.7.3",                          // ✅ Same
    // NO WebSocket/WebRTC libraries
  }
}
```

**codepair peer-cp/go.mod:**
```go
module github.com/elskow/codepair/peer-cp

require (
    github.com/gofiber/fiber/v2 v2.52.5           // HTTP server
    github.com/gofiber/websocket/v2 v2.2.1        // WebSocket support
    github.com/pion/webrtc/v4 v4.0.0-beta.31      // WebRTC library
    go.uber.org/zap v1.27.0                       // Logging
)
```

**InterviewPrep has NO equivalent Go dependencies** - uses TypeScript/Node.js exclusively.

---

## 4. P2 Gap Analysis

### 4.1 P2.1: WebRTC Video Collaboration

**COMPREHENSIVE_AUDIT.md Requirement:**
```
P2.1: Add WebRTC video collaboration
- 4 RTCPeerConnections (local video, remote video, screen share, audio only)
- WebSocket signaling server
- TURN/STUN server configuration
- Estimated: 40 hours, High risk
```

**What codepair Has:**

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **WebRTC Hook** | `client-cp/src/hooks/useWebRTC.ts` | 410 | Complete WebRTC state management |
| **Signaling Server** | `peer-cp/server/webrtc.go` | 162 | Go Fiber WebSocket server |
| **PeerConnection Setup** | `webrtc.go:23-58` | 35 | Pion WebRTC configuration |
| **SDP Handling** | `webrtc.go:61-104` | 43 | Offer/answer exchange |
| **ICE Handling** | `webrtc.go:106-162` | 56 | Candidate gathering/exchange |

**What InterviewPrep Has:**

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **Video Component** | `components/human/video-player.tsx` | 20 | Stream SDK wrapper |
| **Token Generation** | `app/human-rooms/[roomId]/actions.ts` | 40 | Stream token via API |

**Critical Gap:**
```
codepair:  Browser ─WebSocket─> peer-cp (Go) ─WebRTC─> Browser
           410 lines TS          162 lines Go

InterviewPrep: Browser ─SDK─> Stream.io (3rd party)
               20 lines TSX
```

**Migration Blockers:**

1. **No WebSocket Server Infrastructure**
   - codepair: Go Fiber server with `github.com/gofiber/websocket/v2`
   - InterviewPrep: Next.js API Routes (HTTP only, no WebSocket support)
   - **Solution:** Would need separate WebSocket service (Node.js with `ws` or `socket.io`)

2. **No WebRTC Signaling Protocol**
   - codepair: Custom SDP offer/answer exchange in `webrtc.go`
   - InterviewPrep: Stream SDK handles this internally
   - **Solution:** Cannot customize Stream SDK's WebRTC behavior

3. **No Access to Raw RTCPeerConnection**
   - codepair: Direct control via Pion library
   - InterviewPrep: Stream SDK abstracts this away
   - **Solution:** Would need to build custom WebRTC implementation (400+ lines)

4. **Deployment Complexity**
   - codepair: Docker Compose with 3 services
   - InterviewPrep: Single Vercel deployment
   - **Solution:** Would need separate WebSocket server deployment (Heroku, Railway, etc.)

**Honest Assessment:**

P2.1 as specified in COMPREHENSIVE_AUDIT.md is **NOT FEASIBLE** with InterviewPrep's current architecture because:

- Stream SDK is already providing WebRTC video/audio
- Building a custom WebRTC system would require:
  - New WebSocket server (Node.js + socket.io, ~300 lines)
  - New WebRTC signaling protocol (~200 lines)
  - New frontend WebRTC hooks (~410 lines, port from codepair)
  - Separate deployment infrastructure
- **Total effort:** 80+ hours (not 40 hours)
- **Risk:** HIGH - requires expertise in WebRTC protocols

**Alternative:** Leverage Stream SDK's existing features instead of rebuilding WebRTC.

---

### 4.2 P2.2: Real-time Code Collaboration

**COMPREHENSIVE_AUDIT.md Requirement:**
```
P2.2: Add real-time code collaboration
- WebSocket-based code synchronization
- Operational Transform or CRDT for conflict resolution
- Cursor position tracking
- Monaco Editor integration
- Estimated: 32 hours, High risk
```

**What codepair Has:**

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **Editor Hook** | `client-cp/src/hooks/useEditorPeer.ts` | 102 | WebSocket editor sync |
| **Sync Server** | `peer-cp/server/editor.go` | 68 | Go WebSocket broadcast |
| **Room State** | `peer-cp/server/server.go:26-37` | 11 | In-memory room management |
| **Message Protocol** | `editor.go:5-18` | 13 | EditorMessage type definition |

**What InterviewPrep Has:**

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **Code Editor** | `components/code-editor/code-editor-block.tsx` | 102 | Monaco Editor (local only) |
| **Output Display** | `components/code-editor/output.tsx` | 74 | Execution results |

**Critical Gap:**
```
codepair:  Monaco ─onChange─> useEditorPeer ─WebSocket─> peer-cp (Go)
                                   ↓
                              setCode(value)
                                   ↓
                              Broadcast to all clients

InterviewPrep: Monaco ─onChange─> useState(code)
                                   ↓
                              Local state only
                              NO BROADCAST
```

**codepair Implementation (Detailed):**

**client-cp/src/hooks/useEditorPeer.ts:**
```typescript
// Line 20-23: WebSocket connection
const socket = new WebSocket(`${url}/${roomId}?token=${token}`);
socket.addEventListener("message", handleMessage);

// Line 50-60: Send code updates to server
const sendUpdate = useCallback((newCode: string, newLanguage: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
        const message: EditorMessage = {
            type: "code",
            code: newCode,
            language: newLanguage,
            roomId,
        };
        ws.send(JSON.stringify(message));
    }
}, [ws, roomId]);

// Line 62-72: Handle local editor changes
const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined && value !== prevCodeRef.current) {
        setCode(value);
        sendUpdate(value, language);  // ← Broadcast to server
        prevCodeRef.current = value;
    }
}, [language, sendUpdate]);
```

**peer-cp/server/editor.go:**
```go
// Line 24-64: Broadcast to all clients except sender
func (s *Server) handleEditorMessage(ctx context.Context, c *websocket.Conn, 
                                     roomID string, msg EditorMessage) {
    room := s.rooms[roomID]
    
    switch msg.Type {
    case "code":
        room.currentCode = msg.Code       // Update server state
        room.language = msg.Language
    }
    
    messageJSON, _ := json.Marshal(msg)
    
    room.clientsMutex.RLock()
    for client := range room.editorClients {
        if client != c {  // Don't send back to sender
            client.WriteMessage(websocket.TextMessage, messageJSON)
        }
    }
    room.clientsMutex.RUnlock()
}
```

**Migration Blockers:**

1. **No WebSocket Server**
   - codepair: `peer-cp` service handles editor sync
   - InterviewPrep: No WebSocket endpoint exists
   - **Solution:** Would need to build Node.js WebSocket server

2. **No Room State Management**
   - codepair: `Room` struct with `currentCode`, `language`, `editorClients` map
   - InterviewPrep: Room data fetched from database (static)
   - **Solution:** Would need in-memory room state management

3. **No Broadcast Mechanism**
   - codepair: Iterates through `room.editorClients` and sends to each
   - InterviewPrep: No concept of multiple connected clients
   - **Solution:** Would need client registry and broadcast logic

4. **No Conflict Resolution**
   - codepair: Last-write-wins (simple but lossy)
   - InterviewPrep: N/A (no sync)
   - **Solution:** Would need OT (Operational Transform) or CRDT (Conflict-free Replicated Data Type)

**Operational Transform Example (What codepair is MISSING but P2.2 requires):**

```typescript
// Example: Two users editing simultaneously
// User A: "Hello" → "Hello World" (insert " World" at position 5)
// User B: "Hello" → "Hi" (delete characters 2-4)

// Without OT: Conflicts, lost data
// With OT: Transforms operations to preserve intent
const transformInsert = (op1: Insert, op2: Delete) => {
    // Adjust insert position based on delete operation
    if (op2.position < op1.position) {
        op1.position -= op2.length;
    }
    return op1;
};
```

codepair does NOT implement OT/CRDT - it uses simple last-write-wins. P2.2 requires this for production-grade collaboration.

**Honest Assessment:**

P2.2 as specified is **NOT FEASIBLE** with InterviewPrep's current architecture because:

1. **No WebSocket Infrastructure:** Would need to build entire WebSocket server
2. **No Broadcast System:** Would need client registry and message routing
3. **No Conflict Resolution:** codepair doesn't have this either; P2.2 requires it
4. **Real Effort:** 60+ hours (not 32 hours) including:
   - WebSocket server: 20 hours
   - Editor sync protocol: 15 hours
   - OT/CRDT implementation: 25 hours

**Alternative:** Use a real-time collaboration service like:
- **Liveblocks** (Monaco integration available)
- **Yjs** + y-websocket (CRDT-based)
- **Firebase Realtime Database**
- **Supabase Realtime** (PostgreSQL-based)

---

### 4.3 P2.3: Comprehensive Test Suite

**COMPREHENSIVE_AUDIT.md Requirement:**
```
P2.3: Add comprehensive test suite
- Unit tests for utility functions
- Integration tests for API routes
- Component tests with React Testing Library
- E2E tests for critical flows
- Estimated: 24 hours, Low risk
```

**What codepair Has:**

**❌ Zero test files found in codepair codebase**

```bash
$ find codepair/ -name "*.test.ts*" -o -name "*.spec.ts*"
# No results
```

This is HONEST - codepair has no tests despite being production code.

**What InterviewPrep Has:**

**❌ Zero test files found in InterviewPrep codebase**

```bash
$ find . -name "*.test.ts*" -o -name "*.spec.ts*" | grep -v node_modules
# No results
```

**Honest Assessment:**

P2.3 is **FEASIBLE** but NOT based on codepair (codepair has no tests). This would be building from scratch:

- ✅ Low risk (no architectural blockers)
- ✅ Standard Next.js testing setup (Jest + RTL)
- ⚠️ 24 hours might be underestimated for "comprehensive" (40+ hours realistic)

**Recommended Testing Stack:**

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

---

### 4.4 P2.4: Animations/Transitions

**COMPREHENSIVE_AUDIT.md Requirement:**
```
P2.4: Add animations/transitions
- Toast slide-in animations
- Button hover effects
- Panel transitions
- Estimated: 8 hours, Low risk
```

**What codepair Has:**

**app.css animations:**
```css
@keyframes shrink {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

**Toast usage:**
```tsx
// Toast.tsx: Line 15
className="animate-slideIn hover:shadow-xl transition-shadow"
```

**Progress bar:**
```tsx
// Toast.tsx: Line 48
className="animate-shrink"
```

**What InterviewPrep Has:**

**globals.css:**
```css
/* NO custom animations defined */
/* Uses Tailwind defaults only */
```

**Components:**
```tsx
// Minimal transitions
className="transition-colors duration-200"  // Buttons only
```

**Honest Assessment:**

P2.4 is **FEASIBLE** and can learn from codepair:

- ✅ Can copy codepair's animation keyframes
- ✅ Can adopt slideIn, shrink, spin patterns
- ✅ Low risk (CSS-only, no architectural impact)
- ✅ 8 hours is accurate for this scope

**Can be directly applied from FRONTEND_BLUEPRINT_PART1.md and FRONTEND_BLUEPRINT_PART2.md.**

---

### 4.5 P2.5: Panel Resizer

**COMPREHENSIVE_AUDIT.md Requirement:**
```
P2.5: Add panel resizer for code editor
- Draggable divider between panels
- Mouse event handling
- Responsive behavior
- Estimated: 8 hours, Medium risk
```

**What codepair Has:**

**client-cp/src/routes/$roomId.tsx (Line 150-200):**
```tsx
// Line 150: Resizer state
const [editorWidth, setEditorWidth] = useState<number>(50);
const mainContentRef = useRef<HTMLDivElement>(null);
const isDragging = useRef(false);

// Line 180-195: Mouse event handlers
const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.classList.add("resizing");
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
}, [handleMouseMove, handleMouseUp, isMobile]);

const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !mainContentRef.current) return;
    
    const rect = mainContentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    
    // Constrain between 30% and 70%
    const newWidth = Math.min(Math.max(percentage, 30), 70);
    setEditorWidth(newWidth);
}, []);

// Line 240: Resizer UI
<div
    onMouseDown={handleMouseDown}
    className="hidden md:block w-1 bg-[#393939] cursor-col-resize 
               hover:bg-[#0f62fe] transition-colors duration-200"
/>

// Line 260-270: Panel widths
<div style={{ width: isMobile ? "100%" : `${100 - editorWidth}%` }}>
    <WriteSpace />
</div>
<div style={{ width: isMobile ? "100%" : `${editorWidth}%` }}>
    <Editor />
</div>
```

**What InterviewPrep Has:**

**HumanRoomContent.tsx (Line 36):**
```tsx
// Fixed grid layout, NO resizer
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <RoomDetails room={room} />
    <CodeEditorBlock />
</div>
```

**Honest Assessment:**

P2.5 is **FEASIBLE** and can be adapted from codepair:

- ✅ Can copy mouse event handling logic
- ✅ Can adapt to InterviewPrep's layout
- ⚠️ Needs refactoring from grid to flex layout
- ⚠️ 8 hours might be tight (12 hours more realistic)

**Suggested Alternative:**

Use `react-resizable-panels` library (60KB, well-tested):
```tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

<PanelGroup direction="horizontal">
  <Panel defaultSize={50} minSize={30}>
    <RoomDetails room={room} />
  </Panel>
  <PanelResizeHandle />
  <Panel defaultSize={50} minSize={30}>
    <CodeEditorBlock />
  </Panel>
</PanelGroup>
```

**Effort:** 4 hours (with library) vs 12 hours (custom implementation)

---

## 5. Infrastructure Requirements

### 5.1 What codepair Requires (Current)

**docker-compose.dev.yaml:**
```yaml
version: '3.8'

services:
  client:
    build: ./client-cp
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8080
      - VITE_PEER_URL=ws://localhost:8081
  
  core:
    build: ./core-cp
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/codepair
      - JWT_SECRET=secret
    depends_on:
      - db
  
  peer:
    build: ./peer-cp
    ports:
      - "8081:8081"
    environment:
      - CORE_URL=http://core:8080
      - STUN_SERVER=stun:stun.l.google.com:19302
  
  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=codepair
```

**Total:** 4 containers, 3 ports exposed

---

### 5.2 What InterviewPrep Requires (Current)

**Vercel Deployment (Single Service):**
```bash
# No Docker, no docker-compose
$ vercel deploy

# Single Next.js process
# Port 3000 (auto-assigned by Vercel)
```

**External Services:**
- ✅ Neon PostgreSQL (Serverless)
- ✅ Stream.io (Video/Audio SDK)
- ✅ AWS S3 (File storage)
- ✅ Vercel (Hosting)

**Total:** 1 application, 4 external services

---

### 5.3 What P2.1 + P2.2 Would Require

**Option A: Replicate codepair Architecture (Not Recommended)**

```yaml
# docker-compose.yml (CANNOT deploy to Vercel)
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - WEBSOCKET_URL=ws://websocket-server:8081
  
  websocket-server:  # NEW - needs to be built
    build: ./websocket-server
    ports:
      - "8081:8081"
    environment:
      - DATABASE_URL=postgresql://...
  
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
```

**Deployment Complexity:**
- Need VPS or Kubernetes (Vercel doesn't support multi-container)
- Need separate WebSocket server deployment
- Need to manage 2+ services
- **Cost:** $50-100/month (vs $20/month Vercel)

**Option B: Use Real-time Service (Recommended)**

```bash
# Keep Vercel deployment
$ vercel deploy

# Add Liveblocks (real-time collaboration service)
# No additional infrastructure needed
```

**Deployment Complexity:**
- ✅ Single Next.js app (current setup)
- ✅ No WebSocket server to manage
- ✅ Liveblocks handles real-time sync
- **Cost:** $0-50/month (depending on usage)

---

## 6. Implementation Feasibility Assessment

### 6.1 Feasibility Matrix

| P2 Task | Can Apply from codepair? | Effort (Realistic) | Risk | Blockers |
|---------|-------------------------|-------------------|------|----------|
| **P2.1: WebRTC** | ❌ No (different arch) | 80+ hours | HIGH | No WebSocket server, Stream SDK already used |
| **P2.2: Real-time Collab** | ❌ No (different arch) | 60+ hours | HIGH | No WebSocket server, no OT/CRDT |
| **P2.3: Tests** | ❌ No (codepair has none) | 40+ hours | LOW | None (build from scratch) |
| **P2.4: Animations** | ✅ Yes | 8 hours | LOW | None |
| **P2.5: Panel Resizer** | ⚠️ Partial | 12 hours | MEDIUM | Layout refactor needed |

### 6.2 Honest Effort Estimates

**COMPREHENSIVE_AUDIT.md Original Estimates:**
```
P2.1: 40 hours
P2.2: 32 hours
P2.3: 24 hours
P2.4: 8 hours
P2.5: 8 hours
────────────────
Total: 112 hours
```

**Realistic Estimates (After Analysis):**
```
P2.1: 80 hours (custom WebRTC) OR 0 hours (use Stream SDK features)
P2.2: 60 hours (custom WebSocket) OR 16 hours (use Liveblocks)
P2.3: 40 hours (comprehensive suite)
P2.4: 8 hours (can use codepair patterns)
P2.5: 12 hours (custom) OR 4 hours (react-resizable-panels)
────────────────────────────────────────────────────────────────
Total: 200 hours (custom) OR 68 hours (3rd party services)
```

### 6.3 Recommended Approach

**Tier 1: Can Implement Immediately (16 hours)**
- ✅ P2.4: Animations (copy from codepair blueprints)
- ✅ P2.5: Panel Resizer (use react-resizable-panels)

**Tier 2: Requires Moderate Effort (40-60 hours)**
- ⚠️ P2.2: Real-time Collaboration (use Liveblocks, not custom)
- ⚠️ P2.3: Test Suite (build from scratch, not from codepair)

**Tier 3: Not Recommended**
- ❌ P2.1: WebRTC (Stream SDK already handles this)

---

## 7. Recommended Path Forward

### 7.1 What to Apply from codepair

**Design Tokens (High Value, Low Effort):**

From `FRONTEND_BLUEPRINT_PART1.md`, adopt IBM Carbon design system:

```css
/* Can be directly added to globals.css */
:root {
  /* Background Colors */
  --bg-primary: #161616;
  --bg-secondary: #262626;
  --bg-tertiary: #353535;
  
  /* Text Colors */
  --text-primary: #f4f4f4;
  --text-secondary: #c6c6c6;
  --text-tertiary: #8d8d8d;
  
  /* Interactive Colors */
  --blue-primary: #0f62fe;
  --green-success: #42be65;
  --red-error: #fa4d56;
  
  /* Spacing (4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
}
```

**Animations (High Value, Low Effort):**

```css
/* Can be directly added to globals.css */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes shrink {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
```

**Toast System (High Value, Medium Effort):**

Can adapt `Toast.tsx` from `FRONTEND_BLUEPRINT_PART2.md` to use Shadcn Toast component (already in InterviewPrep).

**Component Patterns (Medium Value, Low Effort):**

- Loading states (useRef + useState patterns)
- Form validation (real-time feedback)
- Error handling (structured responses)

---

### 7.2 What NOT to Apply from codepair

**❌ WebRTC Implementation:**
- Reason: Stream SDK already provides video/audio
- Alternative: Explore Stream SDK's advanced features instead

**❌ Custom WebSocket Server:**
- Reason: Requires separate service deployment
- Alternative: Use Liveblocks/Yjs for real-time collaboration

**❌ Go Backend Code:**
- Reason: Cannot run Go code in Next.js
- Alternative: Build equivalent in TypeScript if needed

**❌ Multi-service Architecture:**
- Reason: InterviewPrep is intentionally monolithic
- Alternative: Keep single Next.js app, use 3rd party services

---

### 7.3 Revised P2 Implementation Plan

**Phase 1: Low-Hanging Fruit (16 hours, 1-2 weeks)**

| Task | Effort | Implementation |
|------|--------|----------------|
| P2.4: Animations | 8 hours | Copy keyframes from codepair, apply to components |
| P2.5: Panel Resizer | 4 hours | Install react-resizable-panels |
| Subtotal | 12 hours | |

**Phase 2: Real-time Collaboration (24 hours, 2-3 weeks)**

| Task | Effort | Implementation |
|------|--------|----------------|
| Research Liveblocks | 4 hours | Evaluate pricing, features, Monaco integration |
| Setup Liveblocks | 4 hours | Install SDK, configure rooms |
| Integrate Monaco | 8 hours | Connect editor to Liveblocks sync |
| Test & Debug | 8 hours | Handle edge cases, conflicts |
| Subtotal | 24 hours | |

**Phase 3: Testing Infrastructure (40 hours, 3-4 weeks)**

| Task | Effort | Implementation |
|------|--------|----------------|
| Jest Setup | 4 hours | Configure Jest, RTL, jsdom |
| Unit Tests | 12 hours | Test utilities, helpers, hooks |
| Component Tests | 16 hours | Test CodeEditor, RoomDetails, etc |
| Integration Tests | 8 hours | Test API routes, server actions |
| Subtotal | 40 hours | |

**Total Realistic Effort:** 76 hours (~2 months part-time)

---

### 7.4 Alternative: Minimal P2 Scope

If timeline is critical, consider this minimal scope:

**P2-Lite (28 hours, 1 month):**

| Task | Effort | Value |
|------|--------|-------|
| Design Tokens | 8 hours | HIGH - Improves consistency |
| Animations | 8 hours | MEDIUM - Better UX |
| Panel Resizer | 4 hours | MEDIUM - Better ergonomics |
| Basic Tests | 8 hours | MEDIUM - Code confidence |
| **Total** | **28 hours** | |

Skip real-time collaboration (most complex, least valuable given Stream SDK exists).

---

## 8. Conclusion

### Key Takeaways

1. **codepair and InterviewPrep have fundamentally different architectures**
   - codepair: Microservices (Go backend + React SPA)
   - InterviewPrep: Monolithic (Next.js full-stack)

2. **P2.1 and P2.2 in COMPREHENSIVE_AUDIT.md were based on codepair's capabilities**
   - Assumed infrastructure that doesn't exist in InterviewPrep
   - Original estimates (72 hours) were underestimated (realistic: 140+ hours)

3. **What CAN be applied from codepair:**
   - ✅ Design tokens (IBM Carbon)
   - ✅ Animation patterns
   - ✅ Component UX patterns
   - ✅ CSS architecture

4. **What CANNOT be directly applied:**
   - ❌ WebRTC implementation (use Stream SDK instead)
   - ❌ WebSocket server (use 3rd party service instead)
   - ❌ Go backend code (not applicable to TypeScript)

### Recommended Next Steps

1. **Implement Phase 1 (Low-Hanging Fruit):** 12 hours
   - Design tokens from FRONTEND_BLUEPRINT_PART1.md
   - Animations from FRONTEND_BLUEPRINT_PART2.md
   - Panel resizer (react-resizable-panels)

2. **Evaluate Real-time Options:** 4 hours
   - Research Liveblocks vs Yjs vs Supabase Realtime
   - Compare pricing, features, Monaco integration
   - Make build vs buy decision

3. **Build Testing Infrastructure:** 40 hours
   - NOT based on codepair (codepair has no tests)
   - Follow Next.js testing best practices
   - Focus on critical paths first

4. **Document Decisions:**
   - Update COMPREHENSIVE_AUDIT.md with revised P2 estimates
   - Create ARCHITECTURE_DECISION_RECORDS.md
   - Track technical debt in GitHub Issues

---

**Document Status:** ✅ Complete  
**Last Updated:** January 16, 2026  
**Next Review:** After Phase 1 implementation

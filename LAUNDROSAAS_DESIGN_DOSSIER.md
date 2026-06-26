# LAUNDROSAAS
## PRODUCT & SYSTEM DESIGN DOSSIER

**UX Flows · Personas · Pricing & Revenue Model · System Architecture**

*Multi-Tenant Laundry Management Platform for the Kenyan Market*
*Django REST Framework · React 18 · PostgreSQL · M-Pesa Daraja API*

---

# TABLE OF CONTENTS

| # | Section |
|---|---------|
| 1 | Executive Summary |
| 2 | Problem Framing |
| 3 | User Personas |
| 4 | Core Flow Redesign |
| 5 | Screen Design by Persona |
| 6 | Pricing Model |
| 7 | Revenue Model |
| 8 | System Architecture |
| 9 | Implementation Roadmap |
| 10 | Scope Review & Competitive Analysis |
| 11 | Global Competitor Reference Map |
| 12 | The Hiring Strategy — How This Gets You Abroad |

---

# 1. EXECUTIVE SUMMARY

**LaundroSaaS** is a multi-tenant management platform built for laundry businesses in Kenya. The technical architecture — Django REST Framework, schema-per-tenant isolation, M-Pesa Daraja integration — is sound. What was missing was the **human layer**: how a shop owner, a cashier, an employee, and a customer actually move through the system day to day, and how every one of those moments turns into revenue.

This document closes that gap. It defines the **five people** who touch the platform, redesigns the **three highest-friction flows** around them, and lays out a **pricing and revenue model** that turns "useful software" into a business with **five income streams** and an **80%+ gross margin** at scale.

### The Core Insight

You are not selling laundry software. You are selling the removal of two specific anxieties: **"Is my order ready?"** (the customer's question) and **"Can I pay rent this month?"** (the owner's question). Every screen, notification, and pricing tier in this document is built to answer one of those two questions before it's asked.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAIN → SOLUTION → REVENUE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Pain Point          → Solution              → Revenue Stream    │
│  ───────────────────────────────────────────────────────────    │
│  Customer calls      → Auto-SMS at every     → SMS overage      │
│  "Is it ready?"        status change           billing           │
│                                                                  │
│  Owner loses sleep   → Rent Health           → Pro upgrade       │
│  about rent            dashboard + reserve     (KES 4,999)       │
│                                                                  │
│  M-Pesa fails,       → Auto-retry +          → Transaction fee   │
│  money lost            payment links           on every recovery │
│                                                                  │
│  "You lost my shirt" → Item count + photo    → Trust =          │
│  disputes              + SMS confirmation      retention          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Scorecard at a Glance:**

| Aspect | Rating | Why |
|--------|--------|-----|
| Technical Architecture | 9/10 | Schema-per-tenant, JWT, RBAC — production-grade |
| UX Design | 4/10 | Describes components, not flows. This dossier fixes it |
| Market Fit (Kenya) | 8/10 | M-Pesa + Rent Health is a genuine strong fit |
| Revenue Model | 7/10 | Tiering is sound; transaction fees are the real engine |
| Competitive Awareness | 3/10 | Missing global references. Section 11 adds them |
| Completeness | 6/10 | Strong skeleton; this dossier adds the organs |

---

# 2. PROBLEM FRAMING

The original architecture describes **what** the system does — schemas, endpoints, integrations. It does not describe **how people actually use it**, or where the system currently fails them.

**The Gap Analysis:**

| Already in the Architecture | What Was Missing |
|----------------------------|------------------|
| Schema-per-tenant, JWT auth, RBAC | No clear user journey for each role |
| M-Pesa STK Push integration | No recovery path when a payment times out |
| Order status pipeline (received → delivered) | No automatic customer notification at each step |
| Dashboard with KPIs | No role-specific "what should I do right now" view |
| ML forecasting module | No link from a forecast to a concrete action |

**Two pain points sit above all others**, repeated across nearly every persona:

```
┌─────────────────────────────────────────────────────────────────┐
│                   THE TWO PAIN POINTS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔴 PAIN #1: COMMUNICATION                                       │
│  ──────────────────────                                          │
│  Symptom:  Customers call the shop asking "Is my order ready?"  │
│  Effect:   Interrupts cashier, adds no value, wastes 5+ min/day  │
│  Cost:     Lost orders (customer goes elsewhere)                 │
│  Fix:      Auto-SMS at every status change → Section 4.1        │
│                                                                  │
│  🔴 PAIN #2: RENT ANXIETY                                        │
│  ──────────────────────                                          │
│  Symptom:  Owner cannot tell if this month covers rent           │
│  Effect:   Constant stress, poor financial decisions             │
│  Cost:     Late fees, overdrafts, business closure               │
│  Fix:      Rent Health dashboard → Section 5.2                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Everything that follows — the flows, the dashboard design, and the pricing tiers — is built to resolve these two pain points directly, because they are the reason a shop owner would pay for this software at all.

---

# 3. USER PERSONAS

Five people interact with LaundroSaaS, each with a different job to be done. Designing for "a laundry business" in the abstract leads to generic software. Designing for **Mama Njoro's specific Tuesday afternoon** leads to software people actually want to use.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONA ECOSYSTEM MAP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      ┌──────────────────┐                        │
│                      │   MAMA NJORO     │                        │
│                      │   Shop Owner     │                        │
│                      │   "Can I pay     │                        │
│                      │    rent?"        │                        │
│                      └────────┬─────────┘                        │
│                               │                                  │
│         ┌─────────────────────┼─────────────────────┐            │
│         │                     │                     │            │
│         ▼                     ▼                     ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │    KEVIN     │    │  WANJIKU     │    │  JAMES / MARY    │   │
│  │   Cashier    │    │  Customer    │    │   Employee       │   │
│  │   "Process   │    │  "Is it      │    │   "What do I     │   │
│  │    faster"   │    │   ready?"    │    │    do next?"     │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
│         │                     │                     │           │
│         └─────────────────────┼─────────────────────┘           │
│                               │                                  │
│                               ▼                                  │
│                      ┌──────────────────┐                        │
│                      │   SUPERADMIN     │                        │
│                      │   (You / Team)   │                        │
│                      │   "Are we        │                        │
│                      │    growing?"     │                        │
│                      └──────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👩‍👧  Mama Njoro — Shop Owner / Admin

Owns the shop, manages 2-3 staff, is not particularly tech-savvy, and is the one who ultimately has to find rent money every month.

**Pain Points:**
- Cannot tell if orders are ready without walking to the shop
- Customers call repeatedly asking about order status
- Has no visibility into which employee is actually productive
- Doesn't know if she has enough cash on hand for rent until it's due
- Loses track of M-Pesa payments that failed or timed out

**What They Need to Get Done:**
- See today's cash position at a glance
- Know which orders are overdue for pickup
- Track staff performance without micromanaging
- Get an early warning when rent is due and whether she can afford it

```
┌─────────────────────────────────────────────────────────────────┐
│  MAMA NJORO'S DAY:                                              │
│  ────────────────                                               │
│  8:00 AM  → Opens shop, checks LaundroSaaS on phone             │
│           → Sees Rent Health: "SAFE ✅" — breathes easy         │
│  9:00 AM  → Kevin starts processing orders                      │
│  1:00 PM  → Checks dashboard: 23 orders, KES 9,680 revenue     │
│  4:00 PM  → Sees alert: "3 orders overdue pickup"               │
│           → Sends reminder SMS via one tap                      │
│  6:00 PM  → Closes shop, checks weekly report on phone          │
│           → Sleeps knowing she can pay rent                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👨‍💻  Kevin — Cashier / Daily Operator

Young, comfortable with a smartphone, and processes more than fifty orders a day at the counter.

**Pain Points:**
- Registering a new customer takes too long
- No quick way to price mixed services (wash + iron + fold) on the fly
- Customers dispute payment with no record to check against
- Has to manually text customers when an order is ready
- M-Pesa STK push fails sometimes and the customer gets frustrated at him, not the system

**What They Need to Get Done:**
- Process an order in under sixty seconds
- Have the customer notified automatically when status changes
- Resolve payment disputes with a clear record
- See which services are selling today

```
┌─────────────────────────────────────────────────────────────────┐
│  KEVIN'S DAY:                                                   │
│  ────────────                                                   │
│  9:00 AM  → Opens POS, greeted by dashboard                      │
│  9:05 AM  → Customer walks in                                   │
│           → Types phone number (auto-suggest in 2 seconds)      │
│           → Taps services (Wash 3kg, Iron 5 items — 10 seconds) │
│           → "M-Pesa?" Customer agrees → one tap                 │
│           → Customer gets STK push → pays → receipt printed     │
│           → TOTAL TIME: 45 seconds ✅                           │
│  9:06 AM  → Next customer                                      │
│  2:00 PM  → Sees "Payment pending" badge (M-Pesa timeout)      │
│           → Retries → customer pays → reconciled                │
│  6:00 PM  → End of day → system auto-sends summary              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👩  Wanjiku — Regular Customer

A working professional who drops off laundry on her way to work and wants to forget about it until it's ready.

**Pain Points:**
- Forgets to pick up clothes
- Has no way to know when an order is ready without calling
- Has to call to ask about pricing
- The M-Pesa prompt doesn't always arrive
- No receipt or proof of payment

**What They Need to Get Done:**
- Check order status without phoning the shop
- Get notified the moment the order is ready
- Pay seamlessly and receive a digital receipt
- See her order history and loyalty status

```
┌─────────────────────────────────────────────────────────────────┐
│  WANJIKU'S DAY:                                                 │
│  ──────────────                                                 │
│  7:30 AM  → Drops laundry on way to office                      │
│           → Pays KES 377 via M-Pesa                             │
│           → Gets SMS: "Order #LND-25001 received"               │
│                                                                  │
│  11:30 AM → Gets SMS: "Your order is now WASHING 🧺"           │
│  2:30 PM  → Gets SMS: "Your order is now DRYING 🔥"            │
│  4:00 PM  → Gets SMS: "Your order is now IRONING ✨"           │
│  5:30 PM  → Gets SMS: "✅ READY! Pick up by 8PM"               │
│                                                                  │
│  6:00 PM  → Picks up on way home                                │
│           → Gets SMS: "Rate your experience ★★★★☆"             │
│                                                                  │
│  ── WITHOUT LAUNDROSAAS ──                                      │
│  Calls shop at 11AM, 1PM, 3PM, 5PM → Kevin is annoyed           │
│  Forgets to pick up → clothes stay 3 days                       │
│  Never again                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧑‍🔧  James / Mary — Washer / Ironer (Staff)

Lower digital literacy than Kevin, and needs a task list simple enough to use without training.

**Pain Points:**
- Doesn't know which order to prioritise next
- Has no way to signal "I'm working on this one"
- Gets blamed when something goes wrong, with no record to defend themselves

**What They Need to Get Done:**
- See a simple, ordered task queue
- Mark items as washed, ironed, or ready in one tap
- Report a problem (stain, damage) with a photo attached

```
┌─────────────────────────────────────────────────────────────────┐
│  MARY'S SCREEN (Washer):                                         │
│  ──────────────────────                                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ⏳ PENDING (5 orders)                                 │     │
│  │  #LND-25001 — Wanjiku — 3.5kg — Start Washing  [▶]   │     │
│  │  #LND-25002 — James O.  — 2.0kg — Start Washing  [▶] │     │
│  │  #LND-25003 — Sarah K.  — 5.0kg — Start Washing  [▶] │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🔄 IN PROGRESS (2 orders)                            │     │
│  │  #LND-24998 — Peter — Started 10:30 — Mark Done [✅]  │     │
│  │  #LND-24999 — Grace — Started 11:00 — Mark Done [✅]  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ✅ COMPLETED TODAY: 8 orders                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️  You / The Platform Team — SuperAdmin / Operator

Responsible for onboarding new shops, keeping the platform running, and making sure the business itself stays profitable.

**Pain Points:**
- Tenants churn quietly because they never see the value
- Manual tenant setup is slow and error-prone
- No early signal for which tenants are struggling before they cancel
- Billing disputes with tenants over what they owe

**What They Need to Get Done:**
- Provision a new tenant in one click, fully branded
- Collect subscription billing automatically
- Spot churn risk before the tenant cancels
- Let tenants self-serve plan upgrades

```
┌─────────────────────────────────────────────────────────────────┐
│  SUPERADMIN PANEL (Your View):                                   │
│  ─────────────────────────────                                   │
│                                                                  │
│  💰 COMPANY REVENUE — JULY 2026                                 │
│  MRR: KES 847,000  |  Growth: +18% MoM  |  142 tenants         │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  🟢 Healthy │ │  🟡 At Risk │ │  🔴 Critical│               │
│  │  98 tenants │ │  28 tenants │ │  8 tenants  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                  │
│  CHURN PREDICTION (ML):                                         │
│  1. CleanWave Mombasa — No orders in 5 days → Call owner        │
│  2. QuickWash Nakuru — Payment failed 2x → Offer discount       │
│  3. Sparkle Laundry — 1 login this month → Retention email      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 4. CORE FLOW REDESIGN

Three flows carry almost all of the value in this platform. Each is redesigned below as a sequence of stages, followed by the exact moment automation replaces a phone call or a manual lookup.

## 4.1 The Zero-Call Order Lifecycle

Solves the **communication pain point**. Today, a customer calls, the cashier checks, the cashier updates a status, and the customer often calls again anyway. The redesign removes the phone call entirely by notifying the customer automatically at every meaningful change.

```
┌─────────────────────────────────────────────────────────────────┐
│  ZERO-CALL ORDER LIFECYCLE                                       │
│  ─────────────────────────                                       │
│                                                                  │
│  PHASE 1: DROP-OFF (2 minutes)                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Customer walks in with bag                             │     │
│  │  → Cashier enters phone number (or scans QR)            │     │
│  │  → System auto-creates customer if new                   │     │
│  │  → Cashier taps services (Wash, Iron, Fold)             │     │
│  │  → Customer pays (Cash or M-Pesa)                       │     │
│  │  → AUTO-SMS: "Order #LND-25001 received. 5 items.      │     │
│  │    KES 377. Ready: Tomorrow 5PM"                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  PHASE 2: PROCESSING (Automated)                                │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  2:30 PM → Washing → AUTO-SMS: "Your order is now     │     │
│  │             WASHING 🧺"                                │     │
│  │  4:00 PM → Drying → AUTO-SMS: "Your order is now      │     │
│  │             DRYING 🔥"                                 │     │
│  │  5:30 PM → Ironing → AUTO-SMS: "Your order is now     │     │
│  │             IRONING ✨"                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  PHASE 3: READY FOR PICKUP (Action trigger)                     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  6:00 PM → READY → AUTO-SMS: "✅ Order #LND-25001      │     │
│  │             is READY! Pick up at FreshWash, Tom Mboya  │     │
│  │             St. Open until 8PM."                       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  PHASE 4: OVERDUE (Escalation)                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  24h later → AUTO-SMS: "⏰ Reminder: Your order ready  │     │
│  │              since yesterday. Storage fee KES 50/day   │     │
│  │              after 48hrs."                             │     │
│  │  48h later → Alert on Admin dashboard: "🔴 Overdue     │     │
│  │              pickup: 3 orders"                         │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**What this changes:**

| Before | After |
|--------|-------|
| Customer calls 3-5 times per order | Zero calls — auto-SMS handles everything |
| Cashier spends 5+ min/day on phone | Cashier stays on the counter |
| Orders get forgotten for days | Auto-reminders at 24h and 48h |
| No record of communication | Full audit log of every SMS sent |

## 4.2 The Rent-Proof Payment Flow

Solves the **rent pain point** — the single biggest source of anxiety for an owner. It addresses three specific failures: unpredictable cash flow, M-Pesa payments that silently fail, and disputes over who actually paid.

```
┌─────────────────────────────────────────────────────────────────┐
│  RENT-PROOF PAYMENT FLOW                                         │
│  ─────────────────────────                                        │
│                                                                  │
│  STEP 1: ORDER CREATED AT POS                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Cashier taps: [💵 CASH] [📱 M-PESA] [💳 CARD (future)]│     │
│  │  - Cash: Immediate, no fee, order complete               │     │
│  │  - M-Pesa: Triggers STK Push with built-in resilience    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STEP 2: M-PESA HAPPY PATH                                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  1. System initiates STK Push via Daraja API            │     │
│  │  2. Customer's phone buzzes with PIN prompt             │     │
│  │  3. Customer enters PIN                                 │     │
│  │  4. M-Pesa callback received → ResultCode = 0           │     │
│  │  5. Payment state → "completed"                         │     │
│  │  6. Rent reserve auto-deducted (30% of amount)          │     │
│  │  7. Order status → "received" (paid, start processing)  │     │
│  │  8. Receipt SMS sent to customer                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STEP 3: M-PESA TIMEOUT BRANCH (Revenue Protection)              │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Customer's phone is off or PIN never entered           │     │
│  │  → After 60s: Payment state → "pending"                │     │
│  │  → Cashier sees: "Retry M-Pesa?" [Retry] [Mark Cash]   │     │
│  │  → If Retry: System re-triggers STK Push (2 min delay) │     │
│  │  → Still no response: State → "failed"                 │     │
│  │  → SMS sent: "Payment not completed. Tap to retry:     │     │
│  │    [payment link]"                                     │     │
│  │  → Customer clicks link later → new STK Push → success │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STEP 4: RENT RESERVE AUTO-DEDUCTION                             │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Every successful M-Pesa payment:                      │     │
│  │  - Deduct configurable % into Rent Reserve              │     │
│  │  - Owner sees: "Reserve: KES 12,400 / KES 15,000"     │     │
│  │  - Auto-projection: "You're SAFE ✅" or "CRITICAL 🔴"  │     │
│  │  - Nightly SMS: "Rent status: 83% funded, 8 days left" │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 4.3 M-Pesa Payment Lifecycle — Detailed Sequence

This is the flow with the most revenue at stake, so it gets its own detailed breakdown, including the timeout-and-retry branch that protects revenue when a customer's phone doesn't respond.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  M-PESA PAYMENT LIFECYCLE — STATE MACHINE                                 │
│  ─────────────────────────────────────────                                 │
│                                                                           │
│              ┌─────────────┐                                              │
│              │  INITIATED  │  ← STK Push sent to customer's phone         │
│              └──────┬──────┘                                              │
│                     │                                                     │
│         ┌───────────┴───────────┐                                         │
│         │                       │                                         │
│         ▼                       ▼                                         │
│  ┌───────────┐          ┌───────────┐                                    │
│  │ COMPLETED │          │  PENDING  │  ← 60s timeout, no PIN entered      │
│  │ (Happy)   │          └─────┬─────┘                                    │
│  └───────────┘                │                                           │
│                       ┌───────┴───────┐                                   │
│                       │               │                                   │
│                       ▼               ▼                                   │
│                ┌───────────┐   ┌───────────┐                              │
│                │  RETRY #1 │   │ MARK CASH │  ← Cashier overrides          │
│                └─────┬─────┘   └───────────┘                              │
│                      │                                                    │
│             ┌────────┴────────┐                                           │
│             │                 │                                           │
│             ▼                 ▼                                           │
│      ┌───────────┐     ┌───────────┐                                     │
│      │ COMPLETED  │     │  FAILED   │  ← 2 retries exhausted              │
│      │ (Recovered)│     └─────┬─────┘                                     │
│      └───────────┘           │                                           │
│                              ▼                                           │
│                    ┌──────────────────┐                                   │
│                    │ PAYMENT LINK SENT │  ← Customer can pay later         │
│                    └────────┬─────────┘                                   │
│                             │                                             │
│                    ┌────────┴────────┐                                    │
│                    │                 │                                    │
│                    ▼                 ▼                                    │
│             ┌───────────┐     ┌───────────┐                               │
│             │ COMPLETED │     │  EXPIRED  │  ← Payment abandoned           │
│             │ (Via link)│     └───────────┘                               │
│             └───────────┘                                                 │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Why this matters for revenue:**

| Scenario | Revenue Protected | Without This Flow |
|----------|-----------------|-------------------|
| STK Push times out → retry succeeds | KES 377 order + KES 5.66 fee | Lost order + fee |
| STK Push times out → payment link | KES 377 order + KES 5.66 fee | Lost order + fee |
| Late callback reconciles | KES 377 order + KES 5.66 fee | "Paid" but not in system |
| Cashier retries instead of giving up | KES 377 order + KES 5.66 fee | Cashier says "come back later" |

Every payment that times out and is never retried is **lost revenue** — both the order value and your transaction fee on it. The retry-plus-payment-link branch is what separates a platform that merely accepts M-Pesa from one that actually protects the owner's income.

---

# 5. SCREEN DESIGN BY PERSONA

Each role gets a screen built around **the one decision they need to make**, not a generic dashboard.

## 5.1 Cashier POS Screen — "One-Minute Order"

Designed so Kevin never has to think, only tap.

```
┌─────────────────────────────────────────────────────────────────┐
│  🧺 FRESHWASH POS                              [14:32] [Kevin] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📱 Customer Phone: [0712 345 678    ]  [🔍]                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  👤 Wanjiku Mwangi  •  12 orders  •  Last: yesterday   │     │
│  │  [✓ Use this customer]  [+ New Customer]                │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ─────────────── ONE-TAP SERVICES ───────────────               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ 🧺     │ │ 🔥     │ │ 📦     │ │ ✨     │ │ 👔     │       │
│  │ Wash   │ │ Iron   │ │ Fold   │ │ Dry    │ │ Press  │       │
│  │ KES 50 │ │ KES 30 │ │ KES 20 │ │ KES 80 │ │ KES 40 │       │
│  │ /kg    │ │ /item  │ │ /item  │ │ /item  │ │ /item  │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                  │
│  ─────────────── CART ───────────────                            │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ 🧺 Wash (3.5 kg) [−] [3.5] [+]  ...... KES 175  [🗑️] │     │
│  │ 🔥 Iron (5 items) [−] [5] [+]  ...... KES 150  [🗑️]  │     │
│  │ ─────────────────────────────────────────────           │     │
│  │ Subtotal .................................. KES 325     │     │
│  │ VAT (16%) .................................. KES  52     │     │
│  │ ─────────────────────────────────────────────           │     │
│  │ 💰 TOTAL .................................. KES 377     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  Expected Ready: [Tomorrow 5PM ▼]                                │
│                                                                  │
│  [💵 CASH KES 377]  [📱 M-PESA]  [🧾 SAVE & PRINT]             │
│                                                                  │
│  ─────────────── NEEDS ATTENTION ───────────────                 │
│  🟡 #LND-25005 — Payment pending (M-Pesa timeout)               │
│     [Retry M-Pesa]  [Mark Cash]                                 │
│  🔴 #LND-24998 — Overdue pickup (2 days)                        │
│     [Send Reminder]  [Call Customer]                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

| Element | Decision | Why |
|---------|----------|-----|
| Phone search | Auto-suggest after 3 digits | 2 seconds vs 30 seconds to type full number |
| Service tiles | Large, icon-based, color-coded | Illiterate/low-literacy cashiers can use it |
| Cart | Live-updating, swipe to adjust | No page reloads, no typing numbers |
| Payment buttons | Only 3 actions: Cash, M-Pesa, Save | Decision paralysis kills speed |
| "Needs attention" strip | Always visible at bottom | Prevents forgotten payments/overdue orders |

## 5.2 Owner Dashboard — "Rent Health First"

The Rent Health card is the **hero** of this screen. Everything else is supporting context. This single widget is the reason an owner upgrades from Starter to Pro.

```
┌─────────────────────────────────────────────────────────────────┐
│  🏠 FRESHWASH ADMIN                              [Mama Njoro]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🏦 RENT HEALTH — AUGUST 2026                         │     │
│  │  ─────────────────────────────────────────────         │     │
│  │                                                        │     │
│  │  Rent Due:     KES 15,000  (due in 8 days, Aug 5)    │     │
│  │  Reserve:      KES 12,400  ████████████░░░ 83%        │     │
│  │  Projected:    KES 18,200  ✅ You're SAFE               │     │
│  │                                                        │     │
│  │  [Add KES 2,600 to Reserve]  [Adjust Rent Amount]      │     │
│  │                                                        │     │
│  │  💡 TIP: At current pace, you'll have KES 3,200       │     │
│  │  extra after rent. Consider Pro for ML forecasts.      │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  📊 TODAY    │  │  📈 JULY     │  │  🔔 ACTION   │          │
│  │  Orders: 23  │  │  Revenue: 45K│  │  3 overdue   │          │
│  │  Cash: 8,200 │  │  vs June: +12│  │  pickups     │          │
│  │  M-Pesa: 5K  │  │  Avg: KES 420│  │  2 unpaid    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  📋 ORDERS NEEDING ACTION                               │     │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │     │
│  │  🔴 #LND-25001 — Wanjiku M. — Ready 2 days ago        │     │
│  │     [Send Reminder]  [Waive Fee]  [Call]                │     │
│  │  🟡 #LND-25005 — Payment pending (M-Pesa timeout)      │     │
│  │     [Retry M-Pesa]  [Mark Cash]  [Cancel]               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  👥 EMPLOYEE PERFORMANCE — TODAY                       │     │
│  │  Kevin (Cashier):  ████████████████████  23 orders    │     │
│  │  Mary (Washer):    ██████████████░░░░░░░  18 items    │     │
│  │  John (Ironer):    █████████████████░░░░  15 items    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  💳 BILLING                                            │     │
│  │  Plan: Pro (KES 4,999/mo) • Next: Aug 1 • M-Pesa auto │     │
│  │  Usage: 487 orders / Unlimited • 342 SMS / 500 incl   │     │
│  │  M-Pesa processed: KES 234,000 (fee: KES 3,510)       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**The "Rent Health" Widget is the hero.** Everything else supports it. This is your value slice — the thing that makes Mama Njoro pay KES 4,999/month.

## 5.3 Customer Tracker — No Login Required

Wanjiku should never need to create an account just to check on her laundry. Access is by phone number or by scanning the QR code on her receipt bag.

```
┌─────────────────────────────────────────────────────────────────┐
│  🧺 FreshWash Laundry Tracker                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Enter your phone number to track your order:                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [+254 712 345 678    ]  [Track Order]                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ─── OR ───                                                      │
│                                                                  │
│  Scan QR code on your receipt bag                               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Order #LND-25001 — Wanjiku Mwangi                              │
│  Dropped: Jun 25, 2:30 PM  |  Expected: Jun 26, 5:00 PM        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PROGRESS:                                              │     │
│  │  ●──────────●──────────●──────────●──────────○          │     │
│  │  Received   Washing     Drying     Ironing    Ready      │     │
│  │    ✅         ✅         ✅          🔄        ⏳        │     │
│  │                                                        │     │
│  │  Currently: IRONING (since 4:30 PM)                    │     │
│  │  Estimated ready: Today 5:30 PM                        │     │
│  │                                                        │     │
│  │  [💳 Pay KES 377 via M-Pesa]  [📍 Get Directions]     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  💬 Get updates on WhatsApp: [Enable]                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why this works:**

| Feature | Purpose |
|---------|---------|
| No login required | Zero friction — enter phone, see status |
| QR code scan | Even faster than typing phone number |
| Visual progress bar | Easy to understand at a glance (no reading) |
| "Pay via M-Pesa" button | Payment before arrival = no wait at counter |
| WhatsApp opt-in | Future channel for push updates |

## 5.4 Staff Task Queue — One Screen, Three Sections

Built for James and Mary, who need the lowest possible learning curve.

```
┌─────────────────────────────────────────────────────────────────┐
│  👤 Mary (Washer) — FreshWash                     [🏠 Logout]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ⏳ PENDING WASH (5 orders)                            │     │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │     │
│  │                                                        │     │
│  │  #LND-25001 — Wanjiku M. — 3.5kg — White clothes     │     │
│  │  [🧺 Start Washing]  [📷 Report Issue]                │     │
│  │                                                        │     │
│  │  #LND-25002 — James O. — 2.0kg — Delicates           │     │
│  │  [🧺 Start Washing]  [📷 Report Issue]                │     │
│  │                                                        │     │
│  │  #LND-25003 — Sarah K. — 5.0kg — Bedsheets           │     │
│  │  [🧺 Start Washing]  [📷 Report Issue]                │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🔄 IN PROGRESS (2 orders)                             │     │
│  │  #LND-24998 — Peter N. — Started 10:30 AM            │     │
│  │     [✅ Mark Complete]  [📷 Add Photo]                 │     │
│  │  #LND-24999 — Grace W. — Started 11:00 AM            │     │
│  │     [✅ Mark Complete]  [📷 Add Photo]                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ✅ COMPLETED TODAY (8 orders)                         │     │
│  │  #LND-24990 → #LND-24997                               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  [📊 My Stats: 10 items today]                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Three sections. One screen. Tap to act.** No training needed.

## 5.5 SuperAdmin Panel — The Business View

This is **your** screen — the one that shows whether LaundroSaaS itself is healthy as a company.

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ LAUNDROSAAS SUPERADMIN                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  💰 COMPANY REVENUE — JULY 2026                        │     │
│  │                                                        │     │
│  │  MRR: KES 847,000  |  Growth: +18% MoM  |  142 tenants │     │
│  │                                                        │     │
│  │  Revenue Breakdown:                                    │     │
│  │  ├─ Subscriptions: KES 623,000 (74%)                   │     │
│  │  ├─ M-Pesa fees:   KES 189,000 (22%)                   │     │
│  │  ├─ SMS credits:   KES  28,000 (3%)                    │     │
│  │  └─ Hardware:      KES   7,000 (1%)                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🏢 TENANT HEALTH                                       │     │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │     │
│  │                                                        │     │
│  │  🟢 Healthy:       98 tenants  (rent on track)        │     │
│  │  🟡 At Risk:       28 tenants  (low usage)            │     │
│  │  🔴 Critical:       8 tenants  (no login 7+ days)     │     │
│  │     → [Trigger Retention Email]  [Call Owner]          │     │
│  │                                                        │     │
│  │  [Provision New Tenant]  [Export Report]               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  📈 CHURN PREDICTION (Next 30 days)                    │     │
│  │  1. CleanWave Mombasa — No orders in 5 days            │     │
│  │     [Offer Discount]  [Schedule Call]                   │     │
│  │  2. QuickWash Nakuru — Payment failed 2x               │     │
│  │     [Review Account]  [Call Owner]                      │     │
│  │  3. Sparkle Laundry — 1 login this month               │     │
│  │     [Send Tips Email]  [Ignore]                         │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ⚙️ Platform Settings                                           │
│  Plan definitions | M-Pesa keys | SMS routing | Feature flags  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 6. PRICING MODEL

Pure per-seat pricing is ageing out of SaaS generally, and it fits the Kenyan micro-business market particularly badly — a one-person laundry shop and a five-branch chain should not pay on the same curve. The model below combines a **low-friction entry tier** with **usage-based payment fees** that reward growth instead of penalising it.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PLAN COMPARISON                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  FEATURE              │  🥉 STARTER         │  🥈 PRO              │  🏢 ENTERPRISE   │
│                       │  KES 1,999/mo       │  KES 4,999/mo        │  Custom           │
│  ─────────────────────┼─────────────────────┼──────────────────────┼──────────────────│
│                       │                     │                      │                  │
│  USERS                │  1 cashier          │  3 users             │  Unlimited       │
│  ORDERS               │  300 / month        │  Unlimited           │  Unlimited       │
│  POS                  │  Basic              │  Advanced            │  Multi-branch    │
│  PAYMENTS             │  Cash & M-Pesa     │  Cash & M-Pesa      │  + Card          │
│  SMS / WHATSAPP       │  Not included       │  500 SMS + WhatsApp  │  Unlimited + API │
│  ANALYTICS            │  None               │  Revenue forecast    │  ML + RFM + Custom│
│  RENT HEALTH          │  Not included       │  Reserve + 30-day    │  Reserve + 90-day │
│  M-PESA FEE           │  2.5% (min KES 5)   │  1.5% (min KES 3)   │  1.0% (min KES 2)│
│  SUPPORT              │  WhatsApp only      │  Email + WhatsApp    │  Dedicated Mgr    │
│                       │                     │                      │                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 6.1 Why This Structure Works

| Factor | Explanation |
|--------|-------------|
| **Lower entry point** | KES 1,999 instead of KES 2,500 reduces friction for the smallest shops |
| **Payment fee = upgrade driver** | A shop processing KES 200K/month pays KES 5,000 on Starter vs KES 3,000 on Pro — subscription pays for itself |
| **Rent Health = Pro hook** | Starter gets POS. Pro gets the anxiety-relief dashboard |
| **Enterprise = chains** | Multi-branch owners need custom domains + consolidated reporting |

---

# 7. REVENUE MODEL

LaundroSaaS is a company with **five income streams**, not a single-price product. The mix matters: subscriptions provide predictable recurring income, while transaction fees scale automatically with how much money flows through each shop.

## 7.1 Revenue Streams

```
┌─────────────────────────────────────────────────────────────────┐
│  FIVE REVENUE STREAMS                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STREAM              SOURCE              MARGIN   PREDICTABILITY │
│  ───────────────────────────────────────────────────────────    │
│  💳 SaaS Subs       Monthly fee from     ~85%     High          │
│                      shop owners                  (recurring)   │
│                                                                  │
│  💸 Payment Fee     1.5% per M-Pesa      ~60%     High          │
│                      transaction (Pro)            (volume-based) │
│                                                                  │
│  📱 SMS/WhatsApp    Per-message billing  ~40%     Medium        │
│  Credits            on Starter plan      markup                  │
│                                                                  │
│  🖨️ Hardware        Thermal printers,    ~20%     Low           │
│                      barcode scanners             (one-time)     │
│                                                                  │
│  📊 Data/Insights   Aggregated,         ~90%     Emerging      │
│                      anonymized reports                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 7.2 Unit Economics — One Pro-Tier Tenant, Per Month

```
┌─────────────────────────────────────────────────────────────────┐
│  PER-TENANT P&L (Pro Plan, Average)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  REVENUE TO LAUNDROSAAS:                                         │
│  ├─ Subscription fee               KES  4,999                    │
│  ├─ M-Pesa fees (1.5% of 234K)     KES  3,510                    │
│  ├─ SMS overage (142 msgs over)    KES    284                    │
│  │                                  ─────────                    │
│  │  TOTAL REVENUE                  KES  8,793                    │
│                                                                  │
│  COSTS:                                                          │
│  ├─ Server / infrastructure        KES    800                    │
│  ├─ SMS provider (342 msgs)        KES    274                    │
│  ├─ Payment processing pass-thru   KES    175                    │
│  ├─ Support allocation             KES    300                    │
│  │                                  ─────────                    │
│  │  TOTAL COST                     KES  1,549                    │
│                                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  PROFIT PER TENANT               KES  7,244  (82% margin)       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 7.3 Revenue at Scale

```
┌─────────────────────────────────────────────────────────────────┐
│  SCALE PROJECTIONS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CURRENT:          KES 1.03M/mo  at   142 tenants                │
│  TARGET:           KES 3.62M/mo  at   500 tenants                │
│  SCALE:            KES 7.24M/mo  at 1,000 tenants                │
│                                                                  │
│  Revenue mix at 500 tenants:                                     │
│  ├─ Subscriptions:  KES 2,499,500  (69%)                        │
│  ├─ M-Pesa fees:    KES   886,000  (24%)                        │
│  ├─ SMS credits:    KES   142,000  (4%)                         │
│  └─ Hardware:       KES    90,000  (3%)                         │
│                                                                  │
│  At 82% margin: KES 2,969,000/month profit                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 8. SYSTEM ARCHITECTURE

## 8.1 The Stack Decision

| Option | Web Fit | Mobile Path | Verdict |
|--------|---------|-------------|---------|
| **React 18 + Vite** ✅ | Native feel, fast load | React Native later, ~60% logic reuse | **Selected for web** |
| Flutter Web | Larger bundles, non-native scroll | Seamless into Flutter mobile, ~90% reuse | Reserve for mobile phase only |
| Vue 3 | Excellent on web | No native mobile path | Dead end for mobile plan |
| Node backend | Equivalent to current plan | Same as above | Django is already the right choice |

**Verdict: React 18 + Vite for web, Django stays the backend, Flutter arrives in Phase 2 for mobile.**

Flutter Web is not yet production-ready for a transaction-heavy POS interface — customers feel the difference in scroll physics and load time. Flutter is, however, an excellent choice once you're purpose-building a mobile app, where its near-total code reuse between iOS and Android pays off.

## 8.2 Where Firebase Fits — Selectively, Not as the Core

Your existing django-tenants schema-per-tenant approach gives stronger data isolation than Firebase's tenant_id pattern, and Firebase's per-project app limits work against true multi-tenant scaling. Firebase still earns a place in the stack, just not as the backend of record:

| Service | Use | Why |
|---------|-----|-----|
| **Firebase Cloud Messaging** | Push notifications | Essential for Phase 2 mobile app |
| **Firebase Storage** | Tenant logos, receipt PDFs, damage photos | Cheaper than S3 for small files |
| **Firebase Anonymous Auth** (optional) | Customer tracker remembers returning visitors | Without forcing account creation |

## 8.3 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LAUNDROSAAS — SYSTEM ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TIER 1: FRONTEND (React 18 + Vite + TypeScript)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Web Apps:                                                          │   │
│  │  🧺 POS App       → cashier-optimized, tablet-first, JWT + role     │   │
│  │  🏠 Admin App     → owner dashboard, desktop-first, JWT + role      │   │
│  │  📱 Employee App  → simple task queue, mobile-first                 │   │
│  │  🔍 Customer Tracker → no auth, phone/QR access only                 │   │
│  │  ⚙️ SuperAdmin   → company-wide revenue & tenant health            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  TIER 2: BACKEND (Django 5 + DRF + django-tenants)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Shared Apps (public schema):                                       │   │
│  │  ├─ tenants    → Tenant, Domain, Plan, Feature models              │   │
│  │  ├─ billing    → Subscription, Invoice, PlatformPayment            │   │
│  │  └─ analytics  → Platform-wide metrics, churn prediction            │   │
│  │                                                                     │   │
│  │  Per-Tenant Apps (isolated schema):                                 │   │
│  │  ├─ accounts   → User, Role, Employee, Commission                  │   │
│  │  ├─ laundry    → Order, Service, Customer, Payment,                 │   │
│  │  │               OrderItemCount, Delivery                          │   │
│  │  ├─ inventory  → StockItem, StockMovement                          │   │
│  │  ├─ notifications → Template, Log, ScheduledNotification          │   │
│  │  ├─ rent       → RentReserve, Projection, RentAlert               │   │
│  │  └─ reports    → SalesReport, Export, Receipt                      │   │
│  │                                                                     │   │
│  │  Revenue Engine (shared):                                           │   │
│  │  ├─ SubscriptionBilling (monthly auto-debit via M-Pesa)             │   │
│  │  ├─ TransactionFeeLedger (1.5% per tenant M-Pesa tx)               │   │
│  │  ├─ SMSCreditLedger (overage billing)                               │   │
│  │  └─ CommissionPayout (employee bonuses)                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  TIER 3: EXTERNAL SERVICES                                                   │
│  ├─ M-Pesa Daraja API     → STK Push, C2B, B2C (refunds)                  │
│  ├─ Africa's Talking SMS  → Primary SMS provider (KES 0.80/msg)           │
│  ├─ Twilio                → Backup SMS provider                            │
│  ├─ WhatsApp Business API → Pro/Enterprise only (Phase 2)                  │
│  ├─ Firebase              → FCM (push), Storage (files), Anon Auth         │
│  ├─ SendGrid              → Transactional email, admin alerts              │
│  └─ AWS S3                → Backup, long-term analytics data               │
│                                                                              │
│  TIER 4: INFRASTRUCTURE                                                     │
│  ├─ PostgreSQL 16  → Public schema + one schema per tenant                │
│  ├─ Redis 7        → Cache, Celery broker, session store                  │
│  ├─ Celery 5       → Async tasks: notifications, billing, retries, ML     │
│  ├─ Celery Beat    → Scheduled tasks: nightly projections, reminders       │
│  ├─ Nginx          → Reverse proxy, SSL termination, static files          │
│  ├─ Docker Compose → Local development                                    │
│  └─ AWS/DO         → Production deployment                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.4 Key Model Schemas

### Order Status State Machine

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ RECEIVED │───▶│ WASHING  │───▶│  DRYING  │───▶│ IRONING  │───▶│  READY   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                                     │
                                                            ┌────────┴────────┐
                                                            │                 │
                                                            ▼                 ▼
                                                     ┌──────────┐    ┌──────────┐
                                                     │ DELIVERED│    │ OVERDUE  │
                                                     └──────────┘    └──────────┘
```

### Payment State Machine

```
         ┌──────────┐
         │INITIATED │  ← STK Push sent
         └────┬─────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
┌──────────┐   ┌──────────┐
│COMPLETED │   │ PENDING  │  ← 60s timeout
└──────────┘   └────┬─────┘
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
      ┌──────────┐   ┌──────────┐
      │  RETRY   │   │  CASH    │  ← Cashier override
      └────┬─────┘   └──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌──────────┐ ┌──────────┐
│COMPLETED │ │  FAILED  │
│(Recovered)│ └────┬─────┘
└──────────┘      │
                  ▼
          ┌──────────────┐
          │ PAYMENT LINK │  ← Customer pays later
          └──────┬───────┘
                 │
          ┌──────┴──────┐
          │             │
          ▼             ▼
   ┌──────────┐   ┌──────────┐
   │COMPLETED │   │ EXPIRED  │
   └──────────┘   └──────────┘
```

---

# 9. IMPLEMENTATION ROADMAP

Ordered by **revenue impact against effort**, so the features that protect or generate money are built first.

## 9.1 Phase 1: Core Web (Weeks 1-6)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: "MAKE IT WORK" (6 weeks)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week │ Feature               │ Revenue Impact  │ Effort        │
│  ─────┼───────────────────────┼─────────────────┼──────────────│
│  1-2  │ M-Pesa STK Push      │ 🔥🔥🔥 Critical │ Medium        │
│       │ + auto-retry          │                  │              │
│       │                       │                  │              │
│  2-3  │ Auto-SMS on every    │ 🔥🔥🔥 Critical │ Low           │
│       │ status change         │                  │              │
│       │                       │                  │              │
│  3-4  │ Rent Health dashboard │ 🔥🔥🔥 High     │ Medium        │
│       │ + cash projection     │                  │              │
│       │                       │                  │              │
│  5-6  │ Item count + photo   │ 🔥🔥 High       │ Medium        │
│       │ + SMS confirmation    │                  │              │
│       │                       │                  │              │
│  DONE │ Working POS + M-Pesa + SMS + Rent Health                │
│       │ Mama Njoro can run her whole shop                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 9.2 Phase 2: Revenue Engine (Weeks 7-12)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: "MAKE IT SELL" (6 weeks)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week │ Feature               │ Revenue Impact  │ Effort        │
│  ─────┼───────────────────────┼─────────────────┼──────────────│
│  7-8  │ Customer portal      │ 🔥🔥 High       │ Medium        │
│       │ (no-login tracking)   │                  │              │
│       │                       │                  │              │
│  9-10 │ Tenant onboarding    │ 🔥🔥🔥 Critical │ Medium        │
│       │ + free trial flow     │                  │              │
│       │                       │                  │              │
│ 11-12 │ Subscription billing  │ 🔥🔥🔥 Critical │ High          │
│       │ via M-Pesa auto-debit │                  │              │
│       │                       │                  │              │
│  DONE │ Self-service signup + automated billing                  │
│       │ New tenants can onboard themselves                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 9.3 Phase 3: Scale & Enterprise (Months 4-6)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: "MAKE IT SCALE" (Months 4-6)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Month │ Feature               │ Revenue Impact  │ Effort       │
│  ──────┼───────────────────────┼─────────────────┼─────────────│
│  4     │ Offline mode          │ 🔥🔥 High       │ Medium       │
│        │ (Service Worker + IDB) │                  │             │
│        │                       │                  │             │
│  4-5   │ WhatsApp Business API │ 🔥🔥 High       │ Medium       │
│        │ + SMS fallback        │                  │             │
│        │                       │                  │             │
│  5-6   │ Employee performance  │ 🔥 Medium       │ Low          │
│        │ tracking + queue      │                  │             │
│        │                       │                  │             │
│  5-6   │ Multi-branch support  │ 🔥 Medium       │ High         │
│        │ (Enterprise plan)     │                  │             │
│        │                       │                  │             │
│  DONE │ Complete product for 50+ tenants                        │
│        │ Ready for Enterprise sales                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 9.4 Mobile Phase (Months 7-12)

Once the web platform is stable and earning, Flutter mobile apps consume the same Django API — the API layer is fully reused, business logic patterns carry over at roughly 70%, and only the UI layer is rebuilt natively for mobile.

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: MOBILE (Months 7-12)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Month │ Deliverable                                             │
│  ──────┼────────────────────────────────────────────────────────│
│  7-8   │ Flutter cashier POS app                                │
│        │ - Mobile POS for shops with only phones                │
│        │ - Reuses Django API (100% same endpoints)              │
│        │ - Firebase FCM for push notifications                  │
│        │                                                        │
│  9-10  │ Flutter owner dashboard app                           │
│        │ - Rent Health dashboard in your pocket                │
│        │ - Push alerts for overdue pickups, low reserve         │
│        │                                                        │
│ 11-12  │ Flutter employee app                                   │
│        │ - Simple task queue, scan barcode to claim order       │
│        │ - Photo upload for damage reports                      │
│        │                                                        │
│  DONE  │ Complete mobile offering on both iOS and Android       │
│        │ Same backend, purpose-built native UX                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 10. THE TENANT ONBOARDING FLOW

How Mama Njoro actually becomes a paying tenant is the platform's growth engine, and it deserves the same design attention as the POS itself.

```
┌─────────────────────────────────────────────────────────────────┐
│  TENANT ONBOARDING FUNNEL                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STAGE 1: DISCOVERY                                              │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Mama Njoro hears from a friend or sees a Facebook ad:  │     │
│  │  "Stop worrying about rent — let LaundroSaaS handle it" │     │
│  │  → Visits laundrysaas.com                                 │     │
│  │  → Sees 30-second demo video with Rent Health widget     │     │
│  │  → [Start Free Trial]                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STAGE 2: SIGN-UP (2 minutes)                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Enters:                                                 │     │
│  │  • Shop name: FreshWash Laundry                          │     │
│  │  • Your phone: 0712 345 678                              │     │
│  │  • Your email: mama@freshwash.co.ke                      │     │
│  │  • Subdomain: freshwash                                   │     │
│  │                                                          │     │
│  │  → System auto-creates:                                  │     │
│  │     • Tenant schema in PostgreSQL                        │     │
│  │     • Subdomain at freshwash.laundrysaas.com             │     │
│  │     • Brand theme (default colors)                       │     │
│  │     • Admin account (Mama Njoro)                         │     │
│  │                                                          │     │
│  │  → SMS sent: "Your FreshWash POS is ready! Login at     │     │
│  │    freshwash.laundrysaas.com/pos. Your pass: 123456.    │     │
│  │    Change it now."                                      │     │
│  │                                                          │     │
│  │  TOTAL TIME: 2 minutes, zero human involved              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STAGE 3: TRIAL WEEK (Full Pro access, 7 days)                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Day 1: SMS: "Add your first customer — type their      │     │
│  │          phone number on the POS"                       │     │
│  │  Day 2: SMS: "Process your first order — tap Wash,     │     │
│  │          Iron, Fold, then M-Pesa"                       │     │
│  │  Day 3: SMS: "Check your Rent Health dashboard — see   │     │
│  │          how much you've set aside"                     │     │
│  │  Day 7: SMS: "Your trial ends tomorrow. Upgrade to     │     │
│  │          Pro for KES 4,999/month to keep Rent Health"   │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STAGE 4: CONVERSION                                             │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Option A: [Upgrade via M-Pesa]                        │     │
│  │  → STK Push for KES 4,999                              │     │
│  │  → Auto-billing set up (monthly M-Pesa debit)          │     │
│  │  → Full Pro access continues                            │     │
│  │                                                          │     │
│  │  Option B: [Downgrade to Starter]                       │     │
│  │  → KES 1,999/month, limited to 300 orders               │     │
│  │  → No Rent Health, no SMS                              │     │
│  │  → Still has basic POS                                  │     │
│  │                                                          │     │
│  │  Option C: [No action]                                  │     │
│  │  → Account paused, can't create new orders              │     │
│  │  → Data retained for 30 days                            │     │
│  │  → SMS: "Your account is paused. Reactivate anytime"    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  STAGE 5: RETENTION                                              │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  If no login for 3 days:                                │     │
│  │  → Call from LaundroSaaS: "Hi Mama Njoro, noticed      │     │
│  │    you haven't logged in. Having issues? I can help."   │     │
│  │                                                          │     │
│  │  If no login for 7 days:                                │     │
│  │  → "We've paused your account. Data safe for 23 days."  │     │
│  │                                                          │     │
│  │  If no login for 30 days:                               │     │
│  │  → Data archived. SMS: "We still have your data if     │     │
│  │    you ever come back."                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 11. GLOBAL COMPETITOR REFERENCE MAP

This is the section that was missing from the original architecture. **You cannot build in a vacuum.** Here is every major laundry SaaS globally, what they do well, and what you can learn from them.

## 11.1 🇺🇸 United States — Most Mature Market

```
┌─────────────────────────────────────────────────────────────────┐
│  US COMPETITOR ANALYSIS                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PLATFORM      │ WHAT THEY DO WELL    │ WEAKNESS / GAP          │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  CleanCloud    │ • Multi-tenant SaaS  │ • $50-200/mo — too     │
│  (cleancloud.io)│   model (10K+ shops) │   expensive for Kenya   │
│      10K+ shops│ • Plan tiers          │ • Card-only, no M-Pesa │
│                │ • Clean onboarding    │ • No rent health        │
│                │ • Great POS UX        │                         │
│                │                       │                         │
│  STUDY:        │ Sign up for free trial. Walk through their    │
│  ──────────────│ POS. Screenshot every screen. Copy their flow │
│                │ for order creation, not their pricing.         │
│                │                                                │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  Cents         │ • "Rent OS" concept  │ • US-centric (card/    │
│  (cents.com)   │ • Financial health   │   ACH only)             │
│                │   dashboard          │ • No M-Pesa             │
│                │ • Employee tracking  │ • Target: larger        │
│                │   with commissions   │   laundromats, not      │
│                │                       │   micro-shops           │
│                │                       │                         │
│  STUDY:        │ Their "Rent OS" dashboard is exactly what     │
│  ──────────────│ you're building for Mama Njoro. Copy the      │
│                │ concept, adapt for M-Pesa payments.            │
│                │                                                │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  SplashOS      │ • Modern, clean POS  │ • US-only payments     │
│  (splashos.com) │ • <30s order creation│ • No SMS/WhatsApp      │
│                │ • Tablet-first UX    │   notifications         │
│                │ • Service grid layout│                         │
│                │                       │                         │
│  STUDY:        │ Their POS screen layout is perfect. Copy      │
│  ──────────────│ the quick-add tiles, cart UX, and layout.     │
│                │                                                │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  Turno         │ • Marketplace + SaaS │ • Complex — not just   │
│  (turno.com)   │ • Delivery/rider     │   POS                   │
│                │   management         │ • US market only        │
│                │ • Driver app         │                         │
│                │                       │                         │
│  STUDY:        │ Their driver app is a reference for when      │
│  ──────────────│ you add delivery in Phase 3.                  │
│                │                                                │
└─────────────────────────────────────────────────────────────────┘
```

## 11.2 🇮🇳 India — Most Similar Market Dynamics

**This is your most important reference.** India has the same market dynamics as Kenya: cash-to-digital transition (UPI = M-Pesa), price-sensitive small business owners, mobile-first customers, and similar labor costs.

```
┌─────────────────────────────────────────────────────────────────┐
│  INDIA COMPETITOR ANALYSIS — YOUR BEST REFERENCE                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PLATFORM      │ WHAT THEY DO WELL    │ WEAKNESS / GAP          │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  QuickDry      │ • 5,000+ stores      │ • India-only (payments) │
│  (quickdry.in) │ • Multi-tenant SaaS  │ • No M-Pesa (UPI)       │
│      5K+ stores│ • POS for low-       │ • Hindi/local language  │
│                │   literacy operators │                         │
│                │ • Big buttons,       │                         │
│                │   color-coded        │                         │
│                │ • Payment recon      │                         │
│                │   (UPI timeout →     │                         │
│                │    retry)            │                         │
│                │ • Pricing: ₹999-4,999│                         │
│                │   (≈KES 1,500-7,500) │                         │
│                │                       │                         │
│  STUDY:        │ Watch their POS walkthrough videos on         │
│  ──────────────│ YouTube. Their UPI timeout handling is        │
│                │ identical to what you need for M-Pesa.        │
│                │ Copy their payment retry UX exactly.          │
│                │                                                │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  FabricO       │ • Subscription plans │ • India-only            │
│  (fabrico.in)  │   (Silver/Gold/      │ • Less focus on rent   │
│                │    Premium)          │   health                │
│                │ • Monthly wash plans │                         │
│                │   for customers      │                         │
│                │ • Loyalty programs   │                         │
│                │                       │                         │
│  STUDY:        │ Their subscription model for END CUSTOMERS    │
│  ──────────────│ (not just shops) is what you should add in    │
│                │ Phase 2. "Buy 10 washes, get 1 free" works    │
│                │ in any market.                                │
│                │                                                │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  TumbleDry     │ • Franchise chain    │ • More expensive        │
│  (tumbledry.in)│   management          │ • Focus on franchises  │
│                │ • Multi-branch        │                         │
│                │   consolidated reports│                         │
│                │                       │                         │
│  STUDY:        │ Reference for Enterprise multi-branch plan    │
│  ──────────────│ (Phase 3 or later)                            │
│                │                                                │
│  ──────────────┼──────────────────────┼─────────────────────────│
│  DhobiLite     │ • Customer app       │ • B2C focused, not B2B │
│  (dhobilite.com)│ • Order tracking     │   SaaS for shops       │
│                │ • Real-time updates   │                         │
│                │                       │                         │
│  STUDY:        │ Their customer tracking UX — simple,          │
│  ──────────────│ mobile-first, no clutter                      │
│                │                                                │
└─────────────────────────────────────────────────────────────────┘
```

## 11.3 🇦🇪 UAE — Local Payment Integration Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  UAE COMPETITOR ANALYSIS                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PLATFORM        │ WHAT THEY DO WELL    │ WEAKNESS / GAP        │
│  ────────────────┼──────────────────────┼───────────────────────│
│  JustClean       │ • Local payment      │ • UAE/Africa only     │
│  (justclean.ae)  │   gateways (Apple    │ • More delivery-      │
│                  │   Pay, local cards)  │   focused than POS    │
│                  │ • Driver app         │                       │
│                  │ • Real-time tracking  │                       │
│                  │ • WhatsApp comms      │                       │
│                  │   (100% of notifs)   │                       │
│                  │                       │                       │
│  STUDY:          │ Their WhatsApp notification system — they   │
│  ────────────────│ send 100% of updates via WhatsApp. Open     │
│                  │ rate is 90%+ vs 60% for SMS.                │
│                  │                                               │
│  ────────────────┼──────────────────────┼───────────────────────│
│  ZiQ (ziq.ae)    │ • Multi-vendor mktpl │ • Marketplace model   │
│                  │ • Real-time tracking  │ • Not SaaS for shops  │
│                  │                       │                       │
└─────────────────────────────────────────────────────────────────┘
```

## 11.4 🇿🇦 South Africa — African Context (Offline Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│  SOUTH AFRICA — OFFLINE MODE REFERENCE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PLATFORM        │ WHAT THEY DO WELL    │ WHY IT MATTERS        │
│  ────────────────┼──────────────────────┼───────────────────────│
│  Smartrinse      │ • Offline-capable    │ Load-shedding (power  │
│  (smartrinse.com) │   POS                │ cuts) in SA means    │
│                  │ • Sync when online    │ their system handles  │
│                  │ • Works on basic     │ going offline mid-    │
│                  │   smartphones        │ transaction. Same     │
│                  │                       │ happens in Nairobi    │
│                  │                       │ estates.             │
│                  │                       │                       │
│  STUDY:          │ How Smartrinse handles offline mode —       │
│  ────────────────│ caches customers and services, queues        │
│                  │ orders, syncs when connection returns.       │
│                  │ This is your reference for Phase 3.          │
│                  │                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 11.5 🇰🇪 Kenya — Your Direct Competition

```
┌─────────────────────────────────────────────────────────────────┐
│  KENYA COMPETITOR ANALYSIS — KNOW YOUR MARKET                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  COMPETITOR    │ WHAT THEY DO        │ WEAKNESS = YOUR OPPORTUNITY │
│  ─────────────┼──────────────────────┼────────────────────────────│
│  Ziwa /       │ Marketplace model    │ • They compete WITH shops │
│  Laundrybox   │ (Uber for laundry)   │ • Take commission from    │
│               │ Customer-facing app  │   owner's revenue         │
│               │ (order pickup →      │ • Owner has NO control   │
│               │  wash → deliver)     │ • No rent management      │
│               │                      │                           │
│               │                      │ YOUR EDGE: You help shops │
│               │                      │ run their own business.  │
│               │                      │ You're FOR the shop, not │
│               │                      │ competing with it.        │
│               │                      │                           │
│  ─────────────┼──────────────────────┼───────────────────────────│
│  WashKe       │ On-demand            │ • Customer-facing only   │
│               │ pickup/delivery      │ • No shop management     │
│               │                      │   tools                  │
│               │                      │ • No POS, no analytics   │
│               │                      │                           │
│               │                      │ YOUR EDGE: Complete shop │
│               │                      │ management OS, not just  │
│               │                      │ an ordering app.         │
│               │                      │                           │
│  ─────────────┼──────────────────────┼───────────────────────────│
│  Generic POS  │ Payment collection   │ • Not laundry-specific   │
│  (Kopo Kopo,  │ only                  │ • No order pipeline      │
│  Lipa Later)  │                      │ • No notifications        │
│               │                      • No item tracking         │
│               │                      │                           │
│               │                      │ YOUR EDGE: Purpose-built │
│               │                      │ for laundry, not a generic│
│               │                      │ payment terminal.        │
│               │                      │                           │
└─────────────────────────────────────────────────────────────────┘
```

---

# 12. THE HIRING STRATEGY — HOW THIS GETS YOU ABROAD

This section answers your real question: **"Can I build this project and use it to get a job abroad?"**

The answer is **yes — but not by applying to large companies.** The strategy works specifically with small startups (3-15 people) that are building the exact same architecture, just for a different industry.

## 12.1 Why This Works

```
┌─────────────────────────────────────────────────────────────────┐
│  THE STARTUP HIRING PROBLEM YOU SOLVE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  THEIR PROBLEM:                                                  │
│  ──────────────                                                  │
│  • Post a job → 500 applications who can't build anything       │
│  • Interview 20 people → 19 can't write production code         │
│  • Waste 3 months finding 1 developer                           │
│  • Burn $50K+ in lost productivity                              │
│                                                                  │
│  WHAT YOU OFFER:                                                 │
│  ──────────────                                                  │
│  • "I already built your product category. Here's the code."    │
│  • "Here's the live demo. Here's the architecture diagram."     │
│  • "I can start shipping code on Day 1."                       │
│                                                                  │
│  RESULT: You skip the line. You become the #1 candidate.        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 12.2 Target Markets (Ranked)

```
┌─────────────────────────────────────────────────────────────────┐
│  MARKET COMPARISON — YOUR BEST PATH TO WORKING ABROAD            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RANK │ MARKET    │ VISA PATHWAY           │ SALARY     │ WHY    │
│  ─────┼───────────┼────────────────────────┼────────────┼───────│
│       │           │                        │            │       │
│   🥇  │ CANADA    │ Global Talent Stream   │ CAD 50-80K │ Clear │
│       │           │ (LMIA in 2 weeks)      │            │ path  │
│       │           │ → Work permit in 2 mo   │            │       │
│       │           │ → PR after 1 year      │            │       │
│       │           │                        │            │       │
│   🥈  │ USA       │ O-1 Visa (extraordinary│ $60-90K    │ Harder│
│       │           │ ability — need fame)   │            │ visa  │
│       │           │ OR remote from Kenya   │            │       │
│       │           │                        │            │       │
│   🥉  │ UKRAINE   │ No visa needed (remote)│ $24-48K    │ Fast  │
│       │           │ Work from Kenya        │            │ start │
│       │           │                        │            │       │
│   4   │ GERMANY   │ EU Blue Card (need     │ €45-65K   │ Last  │
│       │           │ degree + job offer)    │            │ resort│
│       │           │ Berlin only (English)  │            │       │
│       │           │                        │            │       │
└─────────────────────────────────────────────────────────────────┘
```

### 🇨🇦 Canada — Your #1 Target

**Why Canada wins:**
- Global Talent Stream = 2-week work permit processing
- Designed specifically for tech workers from any country
- Canadian startups are DESPERATE — they can't compete with US salaries
- You working remotely from Kenya for CAD $60K = cheap for them
- Timezone advantage: you work while they sleep

**Where to find Canadian startups:**
- wellfound.com → Filter: Canada, SaaS, 1-10 employees, Remote
- MaRS Discovery District (marsdd.com) — Toronto startup hub
- FounderFuel (founderfuel.com) — Montreal accelerator
- LinkedIn → Search: "co-founder" + "SaaS" + "Canada" + "1-10 employees"

**What you're looking for:** Any 3-15 person vertical SaaS startup that needs multi-tenant architecture + payment integration. NOT just laundry — salon booking, auto repair, cleaning services, pet grooming, food trucks, etc.

### 🇺🇸 USA — Biggest Market, Hardest Visa

**Reality check:**
- H-1B visa = 20% lottery chance (you need luck)
- O-1 visa = "extraordinary ability" (you need GitHub stars + conference talks + media)
- Most realistic path: Remote from Kenya → build reputation → O-1 in 2-3 years

**Where to find US startups:**
- Y Combinator companies: ycombinator.com/companies → Filter: B2B, SaaS, W24/S24/W25 batches
- Wellfound: SaaS, 1-10 employees, Remote
- Product Hunt: Find small products launched in last 2 years

### 🇺🇦 Ukraine — Fastest to Start Working

**The real opportunity:** US/EU startups with Ukrainian engineering teams. Many YC companies have CTOs in Kyiv and teams of 5-15 Ukrainians. They're open to hiring remotely.

**Where to find them:**
- dou.ua → Job board → Filter: remote, English, product
- LinkedIn: "CTO" + "Kyiv" + "startup" + "remote"
- Look at YC company team pages → find Ukrainian locations

### 🇩🇪 Germany — Last Resort

**Only Berlin.** Only English-speaking startups. Small scene, harder entry. Focus on Canada and US instead.

## 12.3 What to Do Right Now

```
┌─────────────────────────────────────────────────────────────────┐
│  YOUR 90-DAY PLAN TO GETTING HIRED ABROAD                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 1: BUILD (Days 1-60)                                     │
│  ───────────────────────                                         │
│  Week 1-2:   Django backend + multi-tenant setup                 │
│  Week 3-4:   React POS screen + M-Pesa integration              │
│  Week 5-6:   Auto-SMS + Rent Health dashboard                   │
│  Week 7-8:   Deploy to production + create 3 demo tenants       │
│  Week 8:     Record 2-min demo video + clean GitHub README      │
│                                                                  │
│  PHASE 2: POLISH (Days 61-75)                                   │
│  ────────────────────────                                        │
│  Day 61-65:  Write 3 blog posts on Dev.to/Hashnode:             │
│              "Building Multi-Tenant SaaS with Django"            │
│              "M-Pesa Integration Lessons from Production"         │
│              "Schema-Per-Tenant: Why We Chose It"               │
│  Day 66-70:  Publish demo video on YouTube (unlisted)           │
│  Day 71-75:  Add Stripe alongside M-Pesa (shows adaptability)   │
│                                                                  │
│  PHASE 3: OUTREACH (Days 76-90)                                 │
│  ────────────────────────                                        │
│  Day 76-80:  Research 100 target startups:                      │
│              • 40 Canadian (wellfound.com)                      │
│              • 40 US (YC directory, remote-first)               │
│              • 20 Ukrainian (dou.ua, LinkedIn)                  │
│  Day 81-90:  Send 10 personalized emails/day:                   │
│              Subject: "I built [your industry] SaaS — here's    │
│              the demo"                                          │
│              Body: 3 sentences + link to demo + GitHub          │
│              Follow up once after 7 days                        │
│                                                                  │
│  EXPECTED RESULT:                                                │
│  100 emails → 25 open → 10 replies → 5 calls → 1-2 offers      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 12.4 The Outreach Email Template

```
┌─────────────────────────────────────────────────────────────────┐
│  OUTREACH TEMPLATE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Subject: I built what you're building — here's the demo         │
│                                                                  │
│  Hi [Founder Name],                                              │
│                                                                  │
│  I'm a full-stack developer from Kenya. I built a multi-tenant  │
│  SaaS platform for [their industry] businesses:                 │
│                                                                  │
│  🔗 [URL to live demo]                                          │
│  🎥 [Link to 2-min walkthrough video]                           │
│  📂 [Link to GitHub]                                            │
│                                                                  │
│  Tech: Django (schema-per-tenant), React 18, PostgreSQL,        │
│  Stripe/M-Pesa, Celery, Redis.                                  │
│                                                                  │
│  I know you're building [Company Name]. I'm not applying for    │
│  a job — I'm showing you what I can build. If you ever need     │
│  a developer who already understands this domain, I'd love     │
│  to chat.                                                       │
│                                                                  │
│  No pressure. Keep building.                                    │
│                                                                  │
│  [Your Name]                                                   │
│                                                                  │
│  P.S. The demo has 3 tenants on different subdomains. Try      │
│  creating a new one — it takes 5 seconds.                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why this works:**
- No explicit "please hire me" — low pressure
- Live demo > resume — shows competence immediately
- Domain knowledge demonstrated — you studied their industry
- P.S. creates curiosity — they'll click the demo

## 12.5 What You Should Do Tomorrow

| Day | Action |
|-----|--------|
| **Tomorrow** | Sign up for CleanCloud free trial. Use their POS for 30 minutes. Screenshot every screen. |
| **Day 2** | Watch QuickDry demo videos on YouTube. Note their service grid and payment retry UX. |
| **Day 3** | Deploy your Django backend (Railway or $5 DigitalOcean). |
| **Day 4** | Deploy React frontend (Vercel). Create 3 demo tenants. |
| **Day 5** | Add Stripe alongside M-Pesa. Record 2-min demo video with Loom. |
| **Day 6** | Clean GitHub README with architecture diagram and screenshots. |
| **Day 7** | Write first blog post and publish on Dev.to. |
| **Day 8** | Start sending outreach emails. |

**Stop perfecting the architecture. Start shipping.** A live demo in a founder's browser is worth 100 PDFs.

---

# APPENDIX: QUICK-START CODE

## Django Model: Payment with State Machine

```python
# laundry/models.py
class Payment(models.Model):
    METHOD_CHOICES = [
        ("cash", "Cash"),
        ("mpesa", "M-Pesa"),
        ("stripe", "Stripe"),
    ]
    STATE_CHOICES = [
        ("initiated", "STK Push Initiated"),
        ("pending", "Awaiting Customer"),
        ("processing", "Callback Received"),
        ("completed", "Payment Successful"),
        ("failed", "Failed / Cancelled"),
        ("refunded", "Refunded"),
    ]

    order = models.OneToOneField("Order", on_delete=models.CASCADE)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    state = models.CharField(max_length=15, choices=STATE_CHOICES, default="initiated")
    checkout_request_id = models.CharField(max_length=100, blank=True)
    mpesa_receipt = models.CharField(max_length=50, blank=True)
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=2)
    rent_reserve_deducted = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## Django Model: Rent Reserve

```python
# rent/models.py
class RentReserve(models.Model):
    tenant = models.OneToOneField("tenants.Tenant", on_delete=models.CASCADE)
    monthly_rent_kes = models.DecimalField(max_digits=10, decimal_places=2, default=15000)
    due_day_of_month = models.IntegerField(default=5)
    is_auto_reserve = models.BooleanField(default=True)
    auto_reserve_percent = models.DecimalField(max_digits=5, decimal_places=2, default=30)
    reserve_amount_kes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    projected_month_end_kes = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    projection_confidence = models.CharField(
        max_length=10,
        choices=[("safe", "Safe"), ("warning", "Warning"), ("critical", "Critical")],
        default="safe"
    )
```

## Django Model: Orders Needing Action (Dashboard)

```python
@receiver(post_save, sender=Order)
def send_status_notification(sender, instance, created, **kwargs):
    """Auto-trigger SMS when order status changes"""
    if not created and instance.status != instance._previous_status:
        trigger_map = {
            "washing": "Your order is now WASHING 🧺",
            "drying": "Your order is now DRYING 🔥",
            "ironing": "Your order is now IRONING ✨",
            "ready": "✅ Order ready for pickup!",
        }
        message = trigger_map.get(instance.status)
        if message and instance.customer.phone:
            send_sms.delay(
                phone=instance.customer.phone,
                message=f"FreshWash: Order #{instance.order_number}. {message}"
            )
```

## M-Pesa Callback Handler

```python
# laundry/views.py
class MpesaCallbackView(APIView):
    permission_classes = []  # Public — M-Pesa calls this

    def post(self, request):
        result = request.data["Body"]["stkCallback"]

        # Extract AccountReference (Order-{order_number})
        items = result.get("CallbackMetadata", {}).get("Item", [])
        account_ref = next((i["Value"] for i in items if i["Name"] == "AccountReference"), None)
        order_id = account_ref.replace("Order-", "")

        payment = Payment.objects.get(order__order_number=order_id, state__in=["initiated", "pending"])

        if result["ResultCode"] == 0:
            meta = {i["Name"]: i["Value"] for i in items}
            payment.mpesa_receipt = meta["MpesaReceiptNumber"]
            payment.state = "completed"
            payment.paid_at = timezone.now()
            payment.save()

            # Auto-deduct rent reserve
            if hasattr(payment.order.tenant, 'rentreserve'):
                reserve = payment.order.tenant.rentreserve
                deduction = payment.amount * (reserve.auto_reserve_percent / 100)
                reserve.reserve_amount_kes += min(deduction, reserve.monthly_rent_kes - reserve.reserve_amount_kes)
                reserve.save()

            payment.order.status = "received"
            payment.order.save()
            send_receipt_sms(payment)
        else:
            payment.state = "failed"
            payment.save()

            if payment.retry_count < payment.max_retries:
                payment.retry_count += 1
                payment.state = "initiated"
                payment.save()
                retry_stk_push.delay(payment.id, delay=120)

        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})
```

---

*End of Document*
*Prepared by DotNexxt | Nairobi, Kenya | June 2026*
